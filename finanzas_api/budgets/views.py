from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import Budget
from .serializers import BudgetSerializer


class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['month', 'year', 'category']
    ordering_fields = ['month', 'year', 'limit_amount']

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user).select_related('category')

    @action(detail=False, methods=['get'])
    def status(self, request):
        """GET /api/v1/budgets/status/?month=4&year=2026"""
        qs = self.get_queryset()
        month = request.query_params.get('month')
        year  = request.query_params.get('year')
        if month: qs = qs.filter(month=month)
        if year:  qs = qs.filter(year=year)
        return Response(self.get_serializer(qs, many=True).data)
