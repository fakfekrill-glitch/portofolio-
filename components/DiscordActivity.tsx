'use client';

import { useState, useEffect, useRef } from 'react';
import { Music, Play, Gamepad2, Code, MessageCircle, ExternalLink, Radio } from 'lucide-react';

interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  display_name?: string;
  global_name?: string;
}

interface ActivityAsset {
  large_image?: string;
  large_text?: string;
  small_image?: string;
  small_text?: string;
}

interface ActivityTimestamps {
  start?: number;
  end?: number;
}

interface Activity {
  id?: string;
  name: string;
  type: number; // 0: Game/Music, 1: Streaming, 2: Listening, 3: Watching, 4: Custom
  state?: string;
  details?: string;
  application_id?: string;
  timestamps?: ActivityTimestamps;
  assets?: ActivityAsset;
  sync_id?: string;
}

interface SpotifyData {
  track_id: string;
  song: string;
  artist: string;
  album: string;
  album_art_url: string;
  timestamps: {
    start: number;
    end: number;
  };
}

interface LanyardPayload {
  discord_user: DiscordUser;
  discord_status: 'online' | 'idle' | 'dnd' | 'offline';
  activities: Activity[];
  listening_to_spotify?: boolean;
  spotify?: SpotifyData | null;
  active_on_discord_web?: boolean;
  active_on_discord_desktop?: boolean;
  active_on_discord_mobile?: boolean;
}

function resolveAssetUrl(appId?: string, assetId?: string): string {
  if (!assetId) return '';
  if (assetId.startsWith('spotify:')) {
    return `https://i.scdn.co/image/${assetId.replace('spotify:', '')}`;
  }
  if (assetId.startsWith('mp:external/')) {
    return `https://media.discordapp.net/external/${assetId.replace('mp:external/', '')}`;
  }
  if (appId) {
    return `https://cdn.discordapp.com/app-assets/${appId}/${assetId}.png`;
  }
  return '';
}

function formatDuration(ms: number): string {
  if (isNaN(ms) || ms < 0) return '00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export default function DiscordActivity({ discordId = '582206666431266816' }: { discordId?: string }) {
  const [data, setData] = useState<LanyardPayload | null>(null);
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initial HTTP Fetch
  useEffect(() => {
    let isMounted = true;
    const fetchInitial = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`);
        const json = await res.json();
        if (json.success && isMounted) {
          setData(json.data);
        }
      } catch (err) {
        console.warn('Initial Lanyard HTTP fetch failed, WebSocket will take over:', err);
      }
    };
    fetchInitial();
    return () => {
      isMounted = false;
    };
  }, [discordId]);

  // Real-time WebSocket connection
  useEffect(() => {
    let ws: WebSocket | null = null;
    let heartbeatInterval: NodeJS.Timeout | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;

    const connect = () => {
      try {
        ws = new WebSocket('wss://api.lanyard.rest/socket');

        ws.onopen = () => {
          ws?.send(
            JSON.stringify({
              op: 2,
              d: { subscribe_to_id: discordId },
            })
          );
        };

        ws.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data);
            if (payload.op === 1) {
              const interval = payload.d.heartbeat_interval;
              if (heartbeatInterval) clearInterval(heartbeatInterval);
              heartbeatInterval = setInterval(() => {
                if (ws?.readyState === WebSocket.OPEN) {
                  ws.send(JSON.stringify({ op: 3 }));
                }
              }, interval);
            } else if (payload.op === 0) {
              if (payload.t === 'INIT_STATE' || payload.t === 'PRESENCE_UPDATE') {
                const userPresence = payload.d[discordId] || payload.d;
                setData(userPresence);
              }
            }
          } catch (e) {
            console.error('Error parsing Lanyard WS message:', e);
          }
        };

        ws.onclose = () => {
          if (heartbeatInterval) clearInterval(heartbeatInterval);
          reconnectTimeout = setTimeout(connect, 5000);
        };

        ws.onerror = () => {
          ws?.close();
        };
      } catch (err) {
        console.warn('Lanyard socket connection failed:', err);
      }
    };

    connect();

    return () => {
      if (ws) ws.close();
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, [discordId]);

  // Identify active rich presence features
  const activities = data?.activities || [];
  
  // 1. YouTube Watching (type 3 or app named YouTube and not music)
  const watchingYouTube = activities.find(
    (a) =>
      a.type === 3 ||
      (a.name.toLowerCase().includes('youtube') && !a.name.toLowerCase().includes('music'))
  );

  // 2. Music Streaming (Spotify or YouTube Music)
  const spotify = data?.spotify;
  const isListeningSpotify = Boolean(data?.listening_to_spotify && spotify);
  const ytMusicActivity = activities.find(
    (a) =>
      a.name.toLowerCase() === 'youtube music' ||
      (a.type === 2 && !a.name.toLowerCase().includes('spotify'))
  );

  // 3. Game or Coding activity
  const activeApp = activities.find(
    (a) =>
      a.type === 0 &&
      a.name.toLowerCase() !== 'youtube music' &&
      !a.name.toLowerCase().includes('spotify')
  );

  // 4. Custom Status
  const customStatus = activities.find((a) => a.type === 4);

  // Live Track Progress Updater for Music / Video
  const activeMusicTimestamp =
    spotify?.timestamps ||
    ytMusicActivity?.timestamps ||
    watchingYouTube?.timestamps;

  const totalDuration =
    activeMusicTimestamp?.start && activeMusicTimestamp?.end
      ? activeMusicTimestamp.end - activeMusicTimestamp.start
      : 0;

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (activeMusicTimestamp?.start && activeMusicTimestamp?.end) {
      const start = activeMusicTimestamp.start;
      const end = activeMusicTimestamp.end;
      const duration = end - start;

      const update = () => {
        const now = Date.now();
        const elapsed = Math.max(0, Math.min(duration, now - start));
        setCurrentProgress(elapsed);
      };

      timerRef.current = setInterval(update, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeMusicTimestamp?.start, activeMusicTimestamp?.end]);

  if (!data) {
    return (
      <div className="w-full bg-slate-900/60 dark:bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-600 animate-pulse" />
          Menghubungkan Discord Activity...
        </span>
        <Radio className="w-3.5 h-3.5 text-slate-500 animate-spin" />
      </div>
    );
  }

  const { discord_user, discord_status } = data;
  const avatarUrl = discord_user.avatar
    ? `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.webp?size=128`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  const statusStyles: Record<string, { label: string; badge: string; dot: string }> = {
    online: {
      label: 'Online',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-500'
    },
    idle: {
      label: 'Idle / AFK',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      dot: 'bg-amber-500'
    },
    dnd: {
      label: 'Do Not Disturb',
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      dot: 'bg-rose-500'
    },
    offline: {
      label: 'Offline',
      badge: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
      dot: 'bg-slate-500'
    }
  };

  const statusInfo = statusStyles[discord_status] || statusStyles.offline;

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg transition-all duration-300">
      {/* Top Header: Discord User Identity & Status */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <img
              src={avatarUrl}
              alt={discord_user.username}
              className="w-10 h-10 rounded-full border border-slate-700 object-cover"
            />
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${statusInfo.dot}`}
              title={statusInfo.label}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-100 truncate">
                {discord_user.display_name || discord_user.global_name || discord_user.username}
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border ${statusInfo.badge}`}
              >
                {statusInfo.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono truncate">
              @{discord_user.username}
            </p>
          </div>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Live Lanyard</span>
        </div>
      </div>

      {/* Custom Status if available */}
      {customStatus?.state && (
        <div className="mt-3 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
          <MessageCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate italic font-sans">{customStatus.state}</span>
        </div>
      )}

      {/* Primary Activity: YouTube Watching or Music Listening */}
      <div className="mt-3 space-y-3">
        {/* 1. Spotify Listening */}
        {isListeningSpotify && spotify && (
          <div className="p-3 rounded-lg bg-slate-950/80 border border-emerald-950/40 hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5" />
                <span>Listening on Spotify</span>
              </span>
              <a
                href={`https://open.spotify.com/track/${spotify.track_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-emerald-400 transition-colors"
                title="Buka di Spotify"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex items-center gap-3">
              {spotify.album_art_url && (
                <img
                  src={spotify.album_art_url}
                  alt={spotify.album}
                  className="w-12 h-12 rounded object-cover border border-slate-800 shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-100 truncate">{spotify.song}</p>
                <p className="text-xs text-slate-400 truncate">{spotify.artist}</p>
                <p className="text-[11px] text-slate-500 truncate">{spotify.album}</p>
              </div>
            </div>

            {totalDuration > 0 && (
              <div className="mt-2.5">
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-1000 ease-linear rounded-full"
                    style={{ width: `${Math.min(100, (currentProgress / totalDuration) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>{formatDuration(currentProgress)}</span>
                  <span>{formatDuration(totalDuration)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. YouTube Music Listening */}
        {!isListeningSpotify && ytMusicActivity && (
          <div className="p-3 rounded-lg bg-slate-950/80 border border-red-950/40 hover:border-red-500/40 transition-colors">
            <div className="flex items-center justify-between text-[11px] font-mono text-red-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5" />
                <span>Listening on YouTube Music</span>
              </span>
              <a
                href={`https://music.youtube.com/search?q=${encodeURIComponent(
                  `${ytMusicActivity.details || ''} ${ytMusicActivity.state || ''}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-red-400 transition-colors"
                title="Cari di YouTube Music"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex items-center gap-3">
              {ytMusicActivity.assets?.large_image && (
                <img
                  src={resolveAssetUrl(ytMusicActivity.application_id, ytMusicActivity.assets.large_image)}
                  alt="YouTube Music Art"
                  className="w-12 h-12 rounded object-cover border border-slate-800 shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-100 truncate">
                  {ytMusicActivity.details || ytMusicActivity.name}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {ytMusicActivity.state || 'YouTube Music Track'}
                </p>
                {ytMusicActivity.assets?.large_text && (
                  <p className="text-[11px] text-slate-500 truncate">
                    {ytMusicActivity.assets.large_text}
                  </p>
                )}
              </div>
            </div>

            {totalDuration > 0 && (
              <div className="mt-2.5">
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-red-500 h-full transition-all duration-1000 ease-linear rounded-full"
                    style={{ width: `${Math.min(100, (currentProgress / totalDuration) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>{formatDuration(currentProgress)}</span>
                  <span>{formatDuration(totalDuration)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. YouTube Watching */}
        {watchingYouTube && (
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-red-500/40 transition-colors">
            <div className="flex items-center justify-between text-[11px] font-mono text-red-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5" />
                <span>Watching on YouTube</span>
              </span>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                  `${watchingYouTube.details || watchingYouTube.name}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-red-400 transition-colors"
                title="Cari di YouTube"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex items-center gap-3">
              {watchingYouTube.assets?.large_image && (
                <img
                  src={resolveAssetUrl(watchingYouTube.application_id, watchingYouTube.assets.large_image)}
                  alt="YouTube Preview"
                  className="w-12 h-12 rounded object-cover border border-slate-800 shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-100 truncate">
                  {watchingYouTube.details || watchingYouTube.name}
                </p>
                {watchingYouTube.state && (
                  <p className="text-xs text-slate-400 truncate">{watchingYouTube.state}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 4. Coding or Game Activity */}
        {activeApp && (
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-blue-400 mb-1.5">
              {activeApp.name.toLowerCase().includes('code') || activeApp.name.toLowerCase().includes('studio') ? (
                <Code className="w-3.5 h-3.5" />
              ) : (
                <Gamepad2 className="w-3.5 h-3.5" />
              )}
              <span className="uppercase">
                {activeApp.name.toLowerCase().includes('code') ? 'Development' : 'Active App / Game'}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-100 truncate">{activeApp.name}</p>
            {activeApp.details && (
              <p className="text-xs text-slate-400 truncate">{activeApp.details}</p>
            )}
            {activeApp.state && (
              <p className="text-[11px] text-slate-500 truncate">{activeApp.state}</p>
            )}
          </div>
        )}

        {/* 5. Idle fallback when no media/game active */}
        {!isListeningSpotify && !ytMusicActivity && !watchingYouTube && !activeApp && (
          <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80 text-center text-xs text-slate-500">
            <p className="font-mono">Sedang tidak memutar YouTube, musik, atau game.</p>
          </div>
        )}
      </div>

      {/* Device Platform Badges Footer */}
      <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span>POCO X3 Pro Kernel Dev Deck</span>
        <div className="flex items-center gap-2">
          <span className={data.active_on_discord_desktop ? 'text-emerald-400' : 'text-slate-600'}>PC</span>
          <span>•</span>
          <span className={data.active_on_discord_mobile ? 'text-emerald-400' : 'text-slate-600'}>Mobile</span>
          <span>•</span>
          <span className={data.active_on_discord_web ? 'text-emerald-400' : 'text-slate-600'}>Web</span>
        </div>
      </div>
    </div>
  );
}
