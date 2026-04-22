from decimal import Decimal
from django.db.models import Sum
from rest_framework import serializers
from transactions.models import Transaction
from .models import Budget


class BudgetSerializer(serializers.ModelSerializer):
    spent = serializers.SerializerMethodField()
    remaining = serializers.SerializerMethodField()
    percent_used = serializers.SerializerMethodField()

    class Meta:
        model = Budget
        fields = [
            'id', 'category', 'limit_amount',
            'month', 'year',
            'spent', 'remaining', 'percent_used',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at', 'spent', 'remaining', 'percent_used']

    def _get_spent(self, obj):
        return Transaction.objects.filter(
            user=obj.user, category=obj.category,
            type='expense', date__month=obj.month, date__year=obj.year,
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0')

    def get_spent(self, obj):       return self._get_spent(obj)
    def get_remaining(self, obj):   return obj.limit_amount - self._get_spent(obj)
    def get_percent_used(self, obj):
        if obj.limit_amount == 0: return 0
        return round(float(self._get_spent(obj)) / float(obj.limit_amount) * 100, 1)

    def validate_category(self, value):
        if value.user != self.context['request'].user:
            raise serializers.ValidationError('Invalid category.')
        return value

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
