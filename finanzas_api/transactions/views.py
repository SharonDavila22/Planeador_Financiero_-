from decimal import Decimal
from django.db.models import Sum, Q
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
import django_filters

from .models import Transaction
from .serializers import TransactionSerializer


class TransactionFilter(django_filters.FilterSet):
    date_from = django_filters.DateFilter(field_name='date', lookup_expr='gte')
    date_to   = django_filters.DateFilter(field_name='date', lookup_expr='lte')
    min_amount = django_filters.NumberFilter(field_name='amount', lookup_expr='gte')
    max_amount = django_filters.NumberFilter(field_name='amount', lookup_expr='lte')

    class Meta:
        model = Transaction
        fields = ['type', 'category', 'date_from', 'date_to', 'min_amount', 'max_amount']


class TransactionViewSet(viewsets.ModelViewSet):
    """
    Full CRUD for transactions, scoped to the authenticated user.

    Extra actions:
      GET /api/v1/transactions/summary/  — totals & per-category breakdown
    """
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = TransactionFilter
    search_fields = ['description', 'notes']
    ordering_fields = ['date', 'amount', 'created_at']
    ordering = ['-date']

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).select_related('category')

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Return income / expense totals and a per-category breakdown."""
        qs = self.filter_queryset(self.get_queryset())

        agg = qs.aggregate(
            total_income=Sum('amount', filter=Q(type='income')) or Decimal('0'),
            total_expenses=Sum('amount', filter=Q(type='expense')) or Decimal('0'),
        )
        total_income   = agg['total_income']   or Decimal('0')
        total_expenses = agg['total_expenses'] or Decimal('0')

        by_category = (
            qs.values('category__name', 'category__color', 'category__icon', 'type')
              .annotate(total=Sum('amount'))
              .order_by('-total')
        )

        return Response({
            'total_income':   total_income,
            'total_expenses': total_expenses,
            'balance':        total_income - total_expenses,
            'by_category': list(by_category),
        })
