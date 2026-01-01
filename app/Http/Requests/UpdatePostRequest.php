<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePostRequest extends FormRequest
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

        if ($this->input('type') === 'artwork') {
            $rules += [
                'title' => ['required', 'string', 'max:255'],
                'main_artwork' => ['nullable', 'array'],
                'main_artwork.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:20480'],
                'medium' => ['nullable', 'string', 'max:100'],
                'dimensions' => ['nullable', 'string', 'max:100']
            ];

        } else {
            $rules['content'] = ['required', 'string', 'max:1000'];
        }

        return $rules;
    }
}
