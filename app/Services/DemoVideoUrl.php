<?php

namespace App\Services;

/**
 * Demo video URLs (spec 6.6, Phase 3): only YouTube and Vimeo are
 * embeddable. parse() is the single source of truth used by validation
 * and by the embed shown on the public project page, so an arbitrary
 * URL can never end up inside an iframe.
 */
class DemoVideoUrl
{
    /**
     * @return array{provider: string, id: string, embed_url: string}|null
     *                                                                     null when the URL is not a recognised YouTube/Vimeo video URL.
     */
    public static function parse(?string $url): ?array
    {
        if (blank($url)) {
            return null;
        }

        $url = trim($url);

        // YouTube: watch?v=, youtu.be/, shorts/, embed/, live/
        if (preg_match('~^https?://(?:www\.|m\.)?youtube\.com/(?:watch\?(?:[^#]*&)?v=|shorts/|embed/|live/)([A-Za-z0-9_-]{6,20})(?:[&#/?].*)?$~', $url, $m)
            || preg_match('~^https?://youtu\.be/([A-Za-z0-9_-]{6,20})(?:[?&#].*)?$~', $url, $m)) {
            return [
                'provider' => 'youtube',
                'id' => $m[1],
                'embed_url' => 'https://www.youtube-nocookie.com/embed/'.$m[1],
            ];
        }

        // Vimeo: vimeo.com/{id}
        if (preg_match('~^https?://(?:www\.)?vimeo\.com/(\d{5,20})(?:[?&#/].*)?$~', $url, $m)) {
            return [
                'provider' => 'vimeo',
                'id' => $m[1],
                'embed_url' => 'https://player.vimeo.com/video/'.$m[1],
            ];
        }

        return null;
    }

    public static function isValid(?string $url): bool
    {
        return blank($url) || self::parse($url) !== null;
    }

    public static function embedUrl(?string $url): ?string
    {
        return self::parse($url)['embed_url'] ?? null;
    }
}
