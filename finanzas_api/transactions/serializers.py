from rest_framework import serializers
from categories.serializers import CategorySerializer
from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    category_detail = CategorySerializer(source='category', read_only=True)

    class Meta:
        model = Transaction
        fields = [
            'id', 'category', 'category_detail',
            'type', 'amount', 'description',
            'date', 'notes', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'category_detail']

    def validate_category(self, value):
        """Ensure the category belongs to the authenticated user."""
        request = self.context['request']
        if value and value.user != request.user:
            raise serializers.ValidationError('Invalid category.')
        return value

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class TransactionSummarySerializer(serializers.Serializer):
    """Used for the /summary/ endpoint."""
    total_income = serializers.DecimalField(max_digits=14, decimal_places=2)
    total_expenses = serializers.DecimalField(max_digits=14, decimal_places=2)
    balance = serializers.DecimalField(max_digits=14, decimal_places=2)
    by_category = serializers.ListField()
