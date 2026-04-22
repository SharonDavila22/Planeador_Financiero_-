from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Category(models.Model):
    INCOME = 'income'
    EXPENSE = 'expense'
    TYPE_CHOICES = [(INCOME, 'Income'), (EXPENSE, 'Expense')]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default=EXPENSE)
    icon = models.CharField(max_length=50, blank=True, default='💰')
    color = models.CharField(max_length=7, default='#6366f1')  # hex color
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'categories'
        unique_together = ('user', 'name', 'type')
        ordering = ['name']

    def __str__(self):
        return f'{self.name} ({self.type})'
