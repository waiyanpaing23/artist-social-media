<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'type' => ['required', 'in:artwork,status'],
            'content' => ['nullable', 'string', 'max:5000'],
            'media_files.*' => ['nullable', 'image', 'max:10240'],
        ];

        // for artworks posts
        if ($this->input('type') === 'artwork') {
            $rules += [
                'title' => ['required', 'string', 'max:255'],
                'main_artwork' => ['required', 'array', 'min:1'], // 1. Must be a list
                'main_artwork.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:20480'],
                'medium' => ['nullable', 'string', 'max:100'],
                'dimensions' => ['nullable', 'string', 'max:100']
            ];

        // for status posts
        } else {
            $rules['content'] = ['required', 'string', 'max:1000'];
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'main_artwork.required' => 'Please upload your artwork image.',
            'content.required' => 'You cannot post an empty status.',
        ];
    }
}
