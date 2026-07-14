<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Member extends Model
{
    protected $fillable = ['name', 'roll_number'];

    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'project_members');
    }
}
