#!/usr/bin/env node
// Patch 1: @discordjs/voice - await daveLoadPromise before identifying
// This ensures @snazzah/davey is loaded before the DAVE protocol version is sent
// preventing Discord from rejecting with close code 4017
import { readFileSync, writeFileSync } from 'fs';

const voicePath = 'node_modules/@discordjs/voice/dist/index.js';
let voice = readFileSync(voicePath, 'utf8');

if (voice.includes('await daveLoadPromise;')) {
  console.log('[patch] @discordjs/voice already patched, skipping');
} else {
  voice = voice.replace(
    /onWsOpen\(\)\s*\{(\s*if \(this\.state\.code === 0)/,
    'async onWsOpen() {$1'
  );
  voice = voice.replace(
    /(if \(this\.state\.code === 0 \/\* OpeningWs \*\/\) \{)/,
    '$1\n      await daveLoadPromise;'
  );
  writeFileSync(voicePath, voice);
  console.log('[patch] @discordjs/voice patched: await daveLoadPromise in onWsOpen');
}

// Patch 2: discord-player - remove daveEncryption:false, replace discord-voip with @discordjs/voice symlink
const playerPath = 'node_modules/discord-player/dist/index.js';
let player = readFileSync(playerPath, 'utf8');

if (!player.includes('daveEncryption: false')) {
  console.log('[patch] discord-player already patched, skipping');
} else {
  player = player.replace(/\s*daveEncryption: false,\n/g, '\n');
  writeFileSync(playerPath, player);
  console.log('[patch] discord-player patched: removed daveEncryption:false');
}

// Patch 3: replace discord-voip with @discordjs/voice via symlink
import { rmSync, symlinkSync, existsSync, lstatSync } from 'fs';
import { resolve } from 'path';

const voipPath = 'node_modules/discord-player/node_modules/discord-voip';
const targetPath = resolve('node_modules/@discordjs/voice');

let needsSymlink = true;
if (existsSync(voipPath)) {
  const stat = lstatSync(voipPath);
  if (stat.isSymbolicLink()) {
    console.log('[patch] discord-voip symlink already exists, skipping');
    needsSymlink = false;
  } else {
    rmSync(voipPath, { recursive: true, force: true });
  }
}

if (needsSymlink) {
  symlinkSync(targetPath, voipPath);
  console.log('[patch] discord-voip -> @discordjs/voice symlink created');
}
