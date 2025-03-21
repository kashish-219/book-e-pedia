from rest_framework import serializers
from . import models

# Customer serializers
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TBL_Customer_Details
        fields = ['Cust_ID', 'Fname', 'Lname', 'Gender', 'DOB', 'Email', 'Password', 'Phone_Number', 'Building', 'Street', 'City', 'State', 'Country', 'Pincode', 'IsActive']

    def __init__(self,*args,**kwargs):
        super(CustomerSerializer,self).__init__(*args,**kwargs)
        self.Meta.depth = 1           #Shows in-depth data

    def create(self, validated_data):
        password = validated_data.get('Password')
        validated_data['Password'] = make_password(password)
        return super().create(validated_data)

# class CustomerDetailSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = models.TBL_Customer_Details
#         fields = ['Cust_ID', 'Fname', 'Lname', 'Gender', 'DOB', 'Email', 'Password', 'Phone_Number', 'Building', 'Street', 'City', 'State', 'Country', 'Pincode', 'IsActive']
#
#     def __init__(self,*args,**kwargs):
#         super(CustomerDetailSerializer,self).__init__(*args,**kwargs)
#         self.Meta.depth = 1

# Employee serializers
class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TBL_Employee_Details
        fields = ['Emp_ID', 'Emp_Type', 'Fname', 'Lname', 'Gender', 'DOB', 'email', 'Password', 'Phone_Number', 'Address', 'Salary', 'Designation', 'Emp_Photo', 'IsActive']

    def __init__(self,*args,**kwargs):
        super(EmployeeSerializer,self).__init__(*args,**kwargs)
        self.Meta.depth = 1           #Shows in-depth data

# class EmployeeDetailSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = models.TBL_Employee_Details
#         fields = ['Emp_ID', 'Emp_Type', 'Fname', 'Lname', 'Gender', 'DOB', 'Email', 'Password', 'Phone_Number', 'Address', 'Salary', 'Designation', 'Emp_Photo', 'IsActive']
#
#     def __init__(self,*args,**kwargs):
#         super(EmployeeDetailSerializer,self).__init__(*args,**kwargs)
#         self.Meta.depth = 1

# Category serializers
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TBL_Category_Details
        fields = ['Category_ID', 'Category_Name', 'Category_Photo', 'Category_Description', 'IsActive']

    def __init__(self,*args,**kwargs):
        super(CategorySerializer,self).__init__(*args,**kwargs)
        self.Meta.depth = 1           #Shows in-depth data

class CategoryDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TBL_Category_Details
        fields = ['Category_ID', 'Category_Name', 'Category_Photo', 'Category_Description', 'IsActive']

    def __init__(self,*args,**kwargs):
        super(CategoryDetailSerializer,self).__init__(*args,**kwargs)
        self.Meta.depth = 1

# BookType serializers
class BookTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TBL_BookType
        fields = ['Book_ID', 'Book_Name', 'Physical_Book', 'Audio_Book', 'E_Book', 'Video_Book', 'Audio_File', 'Video_File', 'E_Book_File', 'IsActive']

    def __init__(self,*args,**kwargs):
        super(BookTypeSerializer,self).__init__(*args,**kwargs)
        self.Meta.depth = 1           #Shows in-depth data

# class BookTypeDetailSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = models.TBL_BookType
#         fields = ['Book_ID', 'Book_Name', 'Physical_Book', 'Audio_Book', 'E_Book', 'Video_Book', 'Audio_File', 'Video_File', 'E_Book_File', 'IsActive']
#
#     def __init__(self,*args,**kwargs):
#         super(BookTypeDetailSerializer,self).__init__(*args,**kwargs)
#         self.Meta.depth = 1

# Product serializers
class ProductSerializer(serializers.ModelSerializer):
    product_feedback = serializers.StringRelatedField(many=True,read_only=True)
    class Meta:
        model = models.TBL_Product
        fields = ['Product_ID', 'Category_ID', 'Emp_ID', 'Book_ID', 'Product_Name', 'Product_Description', 'Author', 'Publisher', 'Language', 'Number_of_Pages', 'Time_Duration', 'Product_Price', 'Stock', 'Cover_Photo', 'Back_Photo', 'IsActive', 'product_feedback']

    def __init__(self,*args,**kwargs):
        super(ProductSerializer,self).__init__(*args,**kwargs)
        self.Meta.depth = 1           #Shows in-depth data

class ProductDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TBL_Product
        fields = ['Product_ID', 'Category_ID', 'Emp_ID', 'Book_ID', 'Product_Name', 'Product_Description', 'Author', 'Publisher', 'Language', 'Number_of_Pages', 'Time_Duration', 'Product_Price', 'Stock', 'Cover_Photo', 'Back_Photo', 'IsActive']

    def __init__(self,*args,**kwargs):
        super(ProductDetailSerializer,self).__init__(*args,**kwargs)
        self.Meta.depth = 1

# Cart serializers
class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TBL_Cart_Details
        fields = ['Cart_ID', 'Cust_ID', 'Product_ID', 'Product_Quantity', 'Total_Amount']

    def __init__(self,*args,**kwargs):
        super(CartSerializer,self).__init__(*args,**kwargs)
        self.Meta.depth = 1           #Shows in-depth data
        


class MasterOrderSerializer(serializers.ModelSerializer):
    T_Amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    class Meta:
        model = models.TBL_MasterOrder_Details
        fields = '__all__'
    
    def create(self, validated_data):
        print("Validated Data:", validated_data)  # Debugging
        return super().create(validated_data)

# Order serializers
class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TBL_Order_Details
        fields = ['MasterOrder_ID', 'Product_ID', 'Product_Quantity', 'Product_Price', 'T_amount']
    
    def validate(self, data):
        # Custom validation logic if needed
        if data['Product_Quantity'] <= 0:
            raise serializers.ValidationError("Product quantity must be greater than zero.")
        return data


class OrderWithProductSerializer(serializers.ModelSerializer):
    product_details = ProductDetailSerializer(source='Product_ID', read_only=True)

    class Meta:
        model = models.TBL_Order_Details
        fields = ['MasterOrder_ID','Order_ID', 'Product_Quantity', 'Product_Price', 'T_amount', 'product_details']

# Payment serializers
class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TBL_Payment
        fields = ['MasterOrder_ID', 'Payment_Date', 'Payment_Mode', 'Payment_Status', 'Transaction_ID']

    # def __init__(self,*args,**kwargs):
    #     super(PaymentSerializer,self).__init__(*args,**kwargs)
    #     self.Meta.depth = 1           #Shows in-depth data

# Feedback Serializer
class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TBL_Feedback_Details
        fields = ['Cust_ID', 'Description', 'Feedback_DateTime', 'Feedback_ID', 'IsActive', 'Product_ID']

    def __init__(self,*args,**kwargs):
        super(FeedbackSerializer,self).__init__(*args,**kwargs)
        self.Meta.depth = 1           #Shows in-depth data
