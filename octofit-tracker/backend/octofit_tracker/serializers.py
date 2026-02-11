from rest_framework import serializers
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout

class UserSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'team_id', 'total_points', 'created_at']
    
    def get_id(self, obj):
        return str(obj._id)

class TeamSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    
    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'total_points', 'created_at']
    
    def get_id(self, obj):
        return str(obj._id)

class ActivitySerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    
    class Meta:
        model = Activity
        fields = ['id', 'user_id', 'activity_type', 'duration', 'points', 'date', 'created_at']
    
    def get_id(self, obj):
        return str(obj._id)

class LeaderboardSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    
    class Meta:
        model = Leaderboard
        fields = ['id', 'entity_type', 'entity_id', 'entity_name', 'total_points', 'rank', 'last_updated']
    
    def get_id(self, obj):
        return str(obj._id)

class WorkoutSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    
    class Meta:
        model = Workout
        fields = ['id', 'name', 'description', 'activity_type', 'difficulty', 'duration', 'points', 'created_at']
    
    def get_id(self, obj):
        return str(obj._id)
