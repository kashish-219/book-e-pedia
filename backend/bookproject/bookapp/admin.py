from django.contrib import admin
from . import models

# Register your models here.
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['Fname', 'Phone_Number','Email']
    def get_username(self,obj):
        return obj.user.username if obj.user else None
    
admin.site.register(models.TBL_Customer_Details,CustomerAdmin)
admin.site.register(models.TBL_Employee_Details)
admin.site.register(models.TBL_Category_Details)
admin.site.register(models.TBL_BookType)
admin.site.register(models.TBL_Product)
admin.site.register(models.TBL_Cart_Details)
admin.site.register(models.TBL_MasterOrder_Details)
admin.site.register(models.TBL_Order_Details)
admin.site.register(models.TBL_Payment)
admin.site.register(models.TBL_Feedback_Details)
