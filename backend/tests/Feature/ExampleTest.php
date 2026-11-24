<?php

namespace Tests\Feature;

use App\Models\category;
use App\Models\chat_report;
use App\Models\company;
use App\Models\product;
use App\Models\rfq_request;
use App\Models\trade_center_post;
use App\Models\user;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_application_returns_a_successful_response(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_snake_case_resource_routes_resolve_model_bindings(): void
    {
        $admin = user::create([
            'name' => 'Admin',
            'email' => 'admin@example.test',
            'password' => Hash::make('password'),
        ]);
        $admin->forceFill(['role' => 'admin'])->save();
        $this->actingAs($admin, 'sanctum');

        $chat_report = chat_report::create([
            'reported_user_name' => 'Reported user',
            'reporter_name' => 'Reporter',
        ]);
        $this->assertSame('Pending', $chat_report->fresh()->status_label);
        $this->getJson('/api/v1/chat-reports/'.$chat_report->id)
            ->assertOk()
            ->assertJsonPath('data.id', $chat_report->id);

        $supplier = company::create(['name' => 'Supplier', 'type' => 'supplier']);
        $importer = company::create(['name' => 'Importer', 'type' => 'importer']);
        $rfq_request = rfq_request::create([
            'supplier_company_id' => $supplier->id,
            'importer_company_id' => $importer->id,
            'destination_country' => 'Indonesia',
        ]);
        $this->getJson('/api/v1/rfq-requests/'.$rfq_request->id)
            ->assertOk()
            ->assertJsonPath('data.id', $rfq_request->id);

        $author = user::factory()->create();
        $trade_center_post = trade_center_post::create([
            'title' => 'Trade update',
            'slug' => 'trade-update',
            'content' => 'Trade center post content.',
            'author_id' => $author->id,
        ]);
        $this->getJson('/api/v1/trade-center-posts/'.$trade_center_post->id)
            ->assertOk()
            ->assertJsonPath('data.id', $trade_center_post->id);
    }

    public function test_api_authentication_and_role_permissions(): void
    {
        $this->getJson('/api/v1/categories')->assertUnauthorized();

        $moderator = user::create([
            'name' => 'Moderator',
            'email' => 'moderator@example.test',
            'password' => Hash::make('password'),
        ]);
        $moderator->forceFill(['role' => 'moderator'])->save();
        $moderator_token = $this->postJson('/api/v1/auth/login', [
            'email' => $moderator->email,
            'password' => 'password',
        ])->assertOk()->json('data.token');

        $this->withToken($moderator_token)->getJson('/api/v1/chat-reports')->assertOk();
        $this->withToken($moderator_token)->getJson('/api/v1/products')->assertOk();
        $this->withToken($moderator_token)->getJson('/api/v1/categories')->assertForbidden();

        $category = category::create(['slug' => 'moderation-category']);
        $company = company::create(['name' => 'Moderation Supplier', 'type' => 'supplier']);
        $product = product::create([
            'name' => 'Product for review',
            'description' => 'Product description.',
            'price' => 10,
            'currency' => 'USD',
            'moq' => 1,
            'origin_country' => 'Indonesia',
            'category_id' => $category->id,
            'company_id' => $company->id,
        ]);
        $this->withToken($moderator_token)
            ->putJson('/api/v1/products/'.$product->id.'/approve')
            ->assertOk()
            ->assertJsonPath('data.status', 'approved');

        $this->withToken($moderator_token)->postJson('/api/v1/auth/logout')->assertOk();
        Auth::forgetGuards();
        $this->withToken($moderator_token)->getJson('/api/v1/chat-reports')->assertUnauthorized();

        $editor = user::create([
            'name' => 'Editor',
            'email' => 'editor@example.test',
            'password' => Hash::make('password'),
        ]);
        $editor->forceFill(['role' => 'editor'])->save();
        $editor_token = $this->postJson('/api/v1/auth/login', [
            'email' => $editor->email,
            'password' => 'password',
        ])->assertOk()->json('data.token');

        $this->withToken($editor_token)->getJson('/api/v1/trade-center-posts')->assertOk();
        $this->withToken($editor_token)->getJson('/api/v1/chat-reports')->assertForbidden();
    }
}
