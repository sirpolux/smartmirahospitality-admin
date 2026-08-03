<?php

namespace App\Services;

use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

use Cloudinary\Api\Upload\UploadApi;
use Cloudinary\Configuration\Configuration;

// class CloudinaryService
// {
//     public function upload($file, string $folder = 'ovey_store')
//     {
//         $result = Cloudinary::uploadFile(
//             $file->getRealPath(),
//             ["folder" => $folder]
//         );

//         return [
//             'url' => $result->getSecurePath(),
//             'public_id' => $result->getPublicId(),
//         ];
//     }

//     public function delete(string $publicId): void
//     {
//         Cloudinary::destroy($publicId);
//     }
// }


class CloudinaryService
{
    public function upload($file, string $folder = 'ovey_store')
    {
        Configuration::instance([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key'    => env('CLOUDINARY_API_KEY'),
                'api_secret' => env('CLOUDINARY_API_SECRET'),
            ],
            'secure' => true
        ]);

        $uploadApi = new UploadApi();

        return $uploadApi->upload(
            $file->getRealPath(),
            [
                'folder' => $folder,
            ]
        );
    }
}