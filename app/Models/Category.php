<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use SoftDeletes;

    public function parent (): BelongsTo
    {
       return $this->belongsTo(Category::class, 'parent_id');
    }

    public function department (): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
}
