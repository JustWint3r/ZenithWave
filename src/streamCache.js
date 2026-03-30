import { execFile } from 'child_process';
import { promisify } from 'util';
const execFileAsync = promisify(execFile);

// videoId -> { url, expiresAt }
const cache = new Map();

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
  if (cookieFilePath) args.push('--cookies', cookieFilePath);
  args.push(videoUrl);

  const { stdout } = await execFileAsync('yt-dlp', args, { timeout: 30000 });
  const url = stdout.trim().split('\n')[0];
  if (!url) throw new Error('No URL returned by yt-dlp');

  // Cache for 4 minutes (YouTube URLs expire ~6 min)
  cache.set(videoId, { url, expiresAt: Date.now() + 4 * 60 * 1000 });
  console.log(`[yt-dlp] Got and cached stream URL for ${videoId}`);
  return url;
}

export function prewarm(videoId, cookieFilePath) {
  if (cache.has(videoId) && cache.get(videoId).expiresAt > Date.now()) return;
  fetchStreamUrl(videoId, cookieFilePath).catch(err =>
    console.error(`[yt-dlp] Prewarm failed for ${videoId}:`, err.stderr?.trim() || err.message)
  );
}
