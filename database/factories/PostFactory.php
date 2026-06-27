<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = $this->faker->randomElement(['artwork', 'status']);
        return [
            'user_id' => User::factory(),
            'type' => $type,
            'content' => $this->faker->paragraph(),

            'title' => $type === 'artwork' ? $this->faker->sentence(4) : null,
            'medium' => $type === 'artwork' ? $this->faker->randomElement(['Oil on Canvas', 'Digital', 'Watercolor', 'Acrylic']) : null,
            'dimensions' => $type === 'artwork' ? $this->faker->numberBetween(10, 100) . 'x' . $this->faker->numberBetween(10, 100) . ' cm' : null,
        ];
    }
}
