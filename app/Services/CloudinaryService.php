<?php

namespace App\Services;

use Cloudinary\Api\Upload\UploadApi;
use Cloudinary\Configuration\Configuration;

class CloudinaryService
{
    public function __construct()
    {
        Configuration::instance([
            'cloud' => [
                'cloud_name' => config('services.cloudinary.cloud_name'),
                'api_key'    => config('services.cloudinary.api_key'),
                'api_secret' => config('services.cloudinary.api_secret'),
            ],
            'secure' => true,
        ]);
    }

    public function upload($file, string $folder = 'ovey_store'): array
    {
        $result = (new UploadApi())->upload($file->getRealPath(), [
            'folder' => $folder,
        ]);

        return [
            'url'       => $result['secure_url'],
            'public_id' => $result['public_id'],
        ];
    }

    public function delete(string $publicId): void
    {
        (new UploadApi())->destroy($publicId);
    }
}
