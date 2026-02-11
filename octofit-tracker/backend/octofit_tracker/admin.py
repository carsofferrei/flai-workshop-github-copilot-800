from django.contrib import admin
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'team_id', 'total_points', 'created_at')
    search_fields = ('name', 'email')
    list_filter = ('created_at',)
    ordering = ('-total_points',)

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'total_points', 'created_at')
    search_fields = ('name',)
    list_filter = ('created_at',)
    ordering = ('-total_points',)

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'activity_type', 'duration', 'points', 'date', 'created_at')
    search_fields = ('user_id', 'activity_type')
    list_filter = ('activity_type', 'date', 'created_at')
    ordering = ('-date',)

@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ('entity_name', 'entity_type', 'total_points', 'rank', 'last_updated')
    search_fields = ('entity_name',)
    list_filter = ('entity_type', 'last_updated')
    ordering = ('rank',)

@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('name', 'activity_type', 'difficulty', 'duration', 'points', 'created_at')
    search_fields = ('name', 'activity_type')
    list_filter = ('difficulty', 'activity_type', 'created_at')
    ordering = ('name',)
