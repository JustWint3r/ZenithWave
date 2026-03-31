import { execFile, spawn } from 'child_process';
import { promisify } from 'util';
const execFileAsync = promisify(execFile);

const cache = new Map();

const PROXY = process.env.YTDLP_PROXY || null;

export async function fetchStreamUrl(videoId, cookieFilePath) {
  const cached = cache.get(videoId);
  if (cached && cached.expiresAt > Date.now()) {
    console.log(`[yt-dlp] Cache hit for ${videoId}`);
    return cached.url;
  }

  const videoUrl = `https://youtu.be/${videoId}`;
  console.log(`[yt-dlp] Fetching stream URL for ${videoUrl}`);

  const args = [
    '--no-warnings', '--no-playlist', '--no-check-certificates',
    '--js-runtime', 'node',
    '-f', 'bestaudio/best',
    '-g',
  ];
  if (PROXY) args.push('--proxy', PROXY);
  if (cookieFilePath) args.push('--cookies', cookieFilePath);
  args.push(videoUrl);

  const { stdout } = await execFileAsync('yt-dlp', args, { timeout: 30000 });
  const url = stdout.trim().split('\n')[0];
  if (!url) throw new Error('No URL returned by yt-dlp');

  cache.set(videoId, { url, expiresAt: Date.now() + 4 * 60 * 1000 });
  console.log(`[yt-dlp] Got and cached stream URL for ${videoId}`);
  return url;
}

// Stream directly from CDN URL via ffmpeg — no proxy for audio data, full speed
export function createAudioStream(videoId, cookieFilePath) {
  console.log(`[yt-dlp] Creating audio stream for ${videoId}`);

  const cached = cache.get(videoId);

  if (cached && cached.expiresAt > Date.now()) {
    // Use the cached CDN URL — stream directly via ffmpeg without proxy
    console.log(`[yt-dlp] Streaming directly from CDN for ${videoId}`);
    const ffmpeg = spawn('ffmpeg', [
      '-reconnect', '1',
      '-reconnect_streamed', '1',
      '-reconnect_delay_max', '5',
      '-user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      '-i', cached.url,
      '-f', 'webm',
      '-c', 'copy',
      'pipe:1',
    ], { stdio: ['ignore', 'pipe', 'pipe'] });
    ffmpeg.stderr.on('data', (d) => console.log('[ffmpeg]', d.toString().trim()));
    ffmpeg.on('error', (e) => console.error('[ffmpeg] error:', e.message));
    return ffmpeg.stdout;
  }

  // Fallback: stream via yt-dlp through proxy
  console.log(`[yt-dlp] No cache, streaming via yt-dlp+proxy for ${videoId}`);
  const videoUrl = `https://youtu.be/${videoId}`;
  const ytArgs = [
    '--no-warnings', '--no-playlist', '--no-check-certificates',
    '--js-runtime', 'node',
    '-f', 'bestaudio/best',
    '-o', '-',
  ];
  if (PROXY) ytArgs.push('--proxy', PROXY);
  if (cookieFilePath) ytArgs.push('--cookies', cookieFilePath);
  ytArgs.push(videoUrl);

  const ytdlp = spawn('yt-dlp', ytArgs, { stdio: ['ignore', 'pipe', 'pipe'] });
  ytdlp.stderr.on('data', (d) => console.log('[yt-dlp stderr]', d.toString().trim()));
  ytdlp.on('error', (e) => console.error('[yt-dlp] spawn error:', e.message));
  ytdlp.on('close', (code) => {
    if (code !== 0) console.error(`[yt-dlp] exited with code ${code}`);
  });
  return ytdlp.stdout;
}

export function prewarm(videoId, cookieFilePath) {
  if (cache.has(videoId) && cache.get(videoId).expiresAt > Date.now()) return;
  fetchStreamUrl(videoId, cookieFilePath).catch(err =>
    console.error(`[yt-dlp] Prewarm failed for ${videoId}:`, err.stderr?.trim() || err.message)
  );
}
