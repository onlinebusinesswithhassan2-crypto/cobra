/**
 * Official Google AdMob & DoubleClick Live Test Ads Service
 * Fetches real advertisements directly from Google's ad servers over the internet.
 */

// Google's official public VAST Linear Ad endpoint
const GOOGLE_VAST_LINEAR_URL =
  'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp';

// Google's official public VAST Skippable Ad endpoint
const GOOGLE_VAST_SKIPPABLE_URL =
  'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp';

export interface GoogleAdCreative {
  videoUrl: string;
  clickThroughUrl: string;
  adTitle: string;
  durationSeconds: number;
}

// Fallback high-speed video URLs in case of strict network filter
const FALLBACK_TEST_VIDEOS = [
  'https://redirector.gvt1.com/videoplayback/id/f1be9c477e89fd68/aitags/18,22,106,109/source/dclk_video_ads/requiressl/yes/xpc/EgVovf3BOg%3D%3D/acao/yes/ctier/L/ip/0.0.0.0/ipbits/0/expire/1790060218/sparams/ip,ipbits,expire,id,aitags,source,requiressl,xpc,acao,ctier/signature/351654AC1B262A51A2D1C0759F50154374640A6F.686EABA2A14FE495687F557760EF22FBC18DC54B/key/ck2/cpn/BnEF1Mt8-Rsn9--t/itag/18/file/file.mp4',
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
];

export async function fetchLiveGoogleVideoAd(isSkippable: boolean = false): Promise<GoogleAdCreative> {
  const base = isSkippable ? GOOGLE_VAST_SKIPPABLE_URL : GOOGLE_VAST_LINEAR_URL;
  const url = `${base}&correlator=${Date.now()}`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    if (res.ok) {
      const xml = await res.text();
      // Extract video/mp4 media file
      const mediaMatch =
        xml.match(/<MediaFile[^>]+type="video\/mp4"[^>]*><!\[CDATA\[(.*?)\]\]><\/MediaFile>/i) ||
        xml.match(/<MediaFile[^>]*><!\[CDATA\[(.*?)\]\]><\/MediaFile>/i);
      // Extract click through
      const clickMatch = xml.match(/<ClickThrough><!\[CDATA\[(.*?)\]\]><\/ClickThrough>/i);
      // Extract title
      const titleMatch = xml.match(/<AdTitle><!\[CDATA\[(.*?)\]\]><\/AdTitle>/i);
      // Extract duration
      const durationMatch = xml.match(/<Duration><!\[CDATA\[(.*?)\]\]><\/Duration>/i);

      let duration = 10;
      if (durationMatch && durationMatch[1]) {
        const parts = durationMatch[1].split(':');
        if (parts.length === 3) {
          duration = parseInt(parts[0], 10) * 3600 + parseInt(parts[1], 10) * 60 + parseInt(parts[2], 10);
        }
      }

      if (mediaMatch && mediaMatch[1]) {
        return {
          videoUrl: mediaMatch[1].trim(),
          clickThroughUrl: clickMatch && clickMatch[1] ? clickMatch[1].trim() : 'https://play.google.com/store/apps',
          adTitle: titleMatch && titleMatch[1] ? titleMatch[1].trim() : 'Google AdMob Test Ad',
          durationSeconds: duration > 0 ? duration : 10,
        };
      }
    }
  } catch (err) {
    console.warn('Google VAST live feed error, using fallback stream:', err);
  }

  // Graceful fallback to verified Google test video
  return {
    videoUrl: FALLBACK_TEST_VIDEOS[0],
    clickThroughUrl: 'https://play.google.com/store/apps',
    adTitle: 'Google AdMob Sponsored Test Ad',
    durationSeconds: 10,
  };
}
