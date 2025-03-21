from django.db import models
import datetime
from django.core.validators import EmailValidator,RegexValidator
from django.contrib.auth.models import User
import os
from django.core.files.storage import FileSystemStorage
from django.conf import settings

# # Create your models here.
# Customer Details Model

class TBL_Customer_Details(models.Model):
    GENDER_CHOICES = [('M', 'Male'), ('F', 'Female')]
    IS_ACTIVE_CHOICES = [('1', 'Active'), ('0', 'Inactive')]

    Cust_ID = models.AutoField(primary_key=True)
    Fname = models.CharField(max_length=20,null=False)
    Lname = models.CharField(max_length=25,null=False)
    Gender = models.CharField(max_length=1,null=False, choices=GENDER_CHOICES)
    DOB = models.DateField(null=False)
    Email = models.EmailField(unique=True,null=False, validators=[EmailValidator(message="Invalid email format")])
    Password = models.CharField(max_length=255, null=False)
    Phone_Number = models.BigIntegerField(unique=True,null=False) #PositiveBigIntegerField()
    Building = models.CharField(max_length=50, null=True, blank=True)
    Street = models.CharField(max_length=150, null=True, blank=True)
    City = models.CharField(max_length=30, null=True, blank=True)
    State = models.CharField(max_length=20, null=True, blank=True)
    Country = models.CharField(max_length=25, null=True, blank=True)
    Pincode = models.CharField(max_length=6, null=True, blank=True, validators=[RegexValidator(r'^\d{6}$', message="Pincode must be exactly 6 digits")])
    IsActive = models.CharField(max_length=1, choices=IS_ACTIVE_CHOICES, default='1')

    def __str__(self):
        return f"{self.Cust_ID } : {self.Fname} {self.Lname}"

    def save(self, *args, **kwargs):
        # Validate age is 18+
        if self.DOB > (datetime.date.today() - datetime.timedelta(days=365*18)):
            raise ValueError("Customer must be at least 18 years old")
        # Validate phone number length
        if len(str(self.Phone_Number)) != 10:
            raise ValueError("Phone number must be 10 digits")
        super().save(*args, **kwargs)
    class Meta:
        db_table = 'tbl_customer_details'  # Ensure the correct table name is used

# Employee Details Model
def employee_profile_pic_path(instance, filename):
    """
    Function to dynamically set the upload path for employee profile pictures.
    The path will include the Emp_ID.
    """
    return f"Employee_Images/{instance.Emp_ID}/{filename}"

class TBL_Employee_Details(models.Model):
    EMP_TYPE_CHOICES = [('1', 'Admin'),('0', 'Staff')]
    GENDER_CHOICES = [('M', 'Male'), ('F', 'Female')]
    IS_ACTIVE_CHOICES = [('1', 'Active'), ('0', 'Inactive')]

    Emp_ID = models.IntegerField(primary_key=True)
    Emp_Type = models.CharField(max_length=1, choices=EMP_TYPE_CHOICES, default='0')
    Fname = models.CharField(max_length=20,null=False)
    Lname = models.CharField(max_length=25,null=False)
    Gender = models.CharField(max_length=1,null=False, choices=GENDER_CHOICES)
    DOB = models.DateField(null=False)
    email = models.EmailField(unique=True,null=False, validators=[EmailValidator(message="Invalid email format")])
    Password = models.CharField(max_length=15,null=False)
    Phone_Number = models.BigIntegerField(unique=True,null=False)
    Address = models.CharField(max_length=250,null=False)
    Salary = models.DecimalField(max_digits=9, decimal_places=2,null=False)
    Designation = models.CharField(max_length=25)
    # profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    Emp_Photo = models.ImageField(upload_to=employee_profile_pic_path,null=False,blank=False)
    IsActive = models.CharField(max_length=1, choices=IS_ACTIVE_CHOICES, default='1')

    def __str__(self):
        return f"{self.Fname} {self.Lname}"

    def save(self, *args, **kwargs):
        # Validate age is 18+
        if self.DOB > (datetime.date.today() - datetime.timedelta(days=365*18)):
            raise ValueError("Employee must be at least 18 years old")

        # Validate phone number length
        if len(str(self.Phone_Number)) != 10:
            raise ValueError("Phone number must be 10 digits")
        super().save(*args, **kwargs)


# Category Details Model
def category_pic_path(instance, filename):
    return f"Category_Images/{instance.Category_Name}/{filename}"

class TBL_Category_Details(models.Model):
    IS_ACTIVE_CHOICES = [('1', 'Active'), ('0', 'Inactive')]

    Category_ID = models.AutoField(primary_key=True)
    Category_Name = models.CharField(max_length=25, unique=True,null=False)
    Category_Photo = models.ImageField(upload_to=category_pic_path,null=False,blank=False)
    Category_Description = models.CharField(max_length=250,null=False)
    IsActive = models.CharField(max_length=1, choices=IS_ACTIVE_CHOICES, default='1')

    def __str__(self):
        return self.Category_Name

# BookType Model
def Audio_Book_path(instance, filename):
    return f"Audio_Book/{instance.Book_Name}/{filename}"

def E_Book_path(instance, filename):
    return f"E_Book/{instance.Book_Name}/{filename}"

def Video_Book_path(instance, filename):
    return f"Video_Book/{instance.Book_Name}/{filename}"

class TBL_BookType(models.Model):
    IS_ACTIVE_CHOICES = [('1', 'Active'), ('0', 'Inactive')]

    Book_ID = models.AutoField(primary_key=True)
    Book_Name = models.CharField(max_length=250,null=False)
    Physical_Book = models.CharField(max_length=1, default='0',null=False)
    Audio_Book = models.CharField(max_length=1, default='0',null=False)
    E_Book = models.CharField(max_length=1, default='0',null=False)
    Video_Book = models.CharField(max_length=1, default='0',null=False)
    Audio_File = models.FileField(upload_to=Audio_Book_path, null=True, blank=True)
    Video_File = models.FileField(upload_to=Video_Book_path, null=True, blank=True)
    E_Book_File = models.FileField(upload_to=E_Book_path, null=True, blank=True)
    IsActive = models.CharField(max_length=1, choices=IS_ACTIVE_CHOICES, default='1',null=False)

    def __str__(self):
        return f"{self.Book_ID} : {self.Book_Name}"

# # Product Model
class TBL_Product(models.Model):
    IS_ACTIVE_CHOICES = [('1', 'Active'), ('0', 'Inactive')]

    Product_ID = models.AutoField(primary_key=True)
    Category_ID = models.ForeignKey(TBL_Category_Details, on_delete=models.CASCADE)
    Emp_ID = models.ForeignKey(TBL_Employee_Details, on_delete=models.CASCADE)
    Book_ID = models.ForeignKey(TBL_BookType, on_delete=models.CASCADE)
    Product_Name = models.CharField(max_length=150, unique=True,null=False)
    Product_Description = models.CharField(max_length=250,null=False)
    Author = models.CharField(max_length=50,null=False)
    Publisher = models.CharField(max_length=50,null=False)
    Language = models.CharField(max_length=20,null=False)
    Number_of_Pages = models.IntegerField(default=0)
    Time_Duration = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    Product_Price = models.DecimalField(max_digits=6, decimal_places=2, null=False)
    Stock = models.IntegerField(null=False)
    Cover_Photo = models.ImageField(null=False,blank=False)
    Back_Photo = models.ImageField(null=False,blank=False)
    IsActive = models.CharField(max_length=1, choices=IS_ACTIVE_CHOICES, default='1')

    def __str__(self):
        return f"{self.Product_ID} : {self.Product_Name}"

# Cart Details Model
class TBL_Cart_Details(models.Model):
    Cart_ID = models.AutoField(primary_key=True)
    Cust_ID = models.ForeignKey(TBL_Customer_Details, on_delete=models.CASCADE)
    Product_ID = models.ForeignKey(TBL_Product, on_delete=models.CASCADE)
    Product_Quantity = models.IntegerField(null=False)
    Total_Amount = models.DecimalField(max_digits=8, decimal_places=2)

    def save(self, *args, **kwargs):
        # Calculate the total amount based on the product price and quantity
        if self.Product_ID:
            self.Total_Amount = self.Product_ID.Product_Price * self.Product_Quantity
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Cart {self.Cart_ID} for Customer {self.Cust_ID}"

# # Master Order Details Model
class TBL_MasterOrder_Details(models.Model):
    ORDER_STATUS_CHOICES = [
        ('Completed', 'Completed'),
        ('Pending', 'Pending'),
        ('Shipped', 'Shipped'),
        ('Processing', 'Processing'),
    ]

    MasterOrder_ID = models.AutoField(primary_key=True)
    Cust_ID = models.ForeignKey(TBL_Customer_Details, on_delete=models.CASCADE)
    Emp_ID = models.ForeignKey(TBL_Employee_Details, on_delete=models.CASCADE)
    Order_DateTime = models.DateField(auto_now_add=True)
    T_Quantity = models.IntegerField(default=1)
    T_Amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    # T_Amount = models.DecimalField(max_digits=8, decimal_places=2, null=False)
    Order_Status = models.CharField(max_length=20, null=False, choices=ORDER_STATUS_CHOICES)

    def __str__(self):
        return f"MasterOrder ID {self.MasterOrder_ID} for Customer {self.Cust_ID}"

# Order Details Model
class TBL_Order_Details(models.Model):
    COMFIRMATION_CHOICES = [('1', 'Confirmed'), ('0', 'Not Confirmed')]

    Order_ID = models.AutoField(primary_key=True)
    MasterOrder_ID = models.ForeignKey(TBL_MasterOrder_Details, on_delete=models.CASCADE,related_name='order_details')
    Product_ID = models.ForeignKey(TBL_Product, on_delete=models.CASCADE)
    Product_Quantity = models.IntegerField(null=False)
    Product_Price = models.DecimalField(max_digits=6, decimal_places=2, null=False)
    T_amount = models.DecimalField(max_digits=8, decimal_places=2, null=False)
    Confirmation = models.CharField(max_length=1, default='0', choices=COMFIRMATION_CHOICES)

    def save(self, *args, **kwargs):
        # Fetch product price from the product table
        if self.Product_ID:
            self.Product_Price = self.Product_ID.Product_Price

        # Calculate T_amount based on Product_Price and Product_Quantity
        self.T_amount = self.Product_Price * self.Product_Quantity

        super().save(*args, **kwargs)  # Call the original save method
    # def save(self, *args, **kwargs):
    #     # Fetch product price from the product table
    #     if self.Product_ID:
    #         self.Product_Price = self.Product_ID.Product_Price

    #     # Fetch T_Amount from the master order table
    #     if self.MasterOrder_ID:
    #         self.Product_Quantity = self.MasterOrder_ID.T_Quantity
    #         self.T_amount = self.MasterOrder_ID.T_Amount

    #     super().save(*args, **kwargs)  # Call the original save method

    def __str__(self):
        return f"Order ID : {self.Order_ID} for Customer {self.MasterOrder_ID.Cust_ID}"

# # Payment Model
class TBL_Payment(models.Model):
    PAYMENT_STATUS_CHOICES = [('1', 'Paid'), ('0', 'Unpaid')]

    Transaction_ID = models.AutoField(primary_key=True)
    MasterOrder_ID = models.ForeignKey(TBL_MasterOrder_Details, on_delete=models.CASCADE)
    Payment_Mode = models.CharField(max_length=20,null=False)
    Payment_Status = models.CharField(max_length=1,default=0, choices=PAYMENT_STATUS_CHOICES)
    Payment_Date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Transaction ID: {self.Transaction_ID} for Customer {self.MasterOrder_ID.Cust_ID} on {self.Payment_Date}"

# # Feedback Model
class TBL_Feedback_Details(models.Model):
    Feedback_ID = models.AutoField(primary_key=True)
    Product_ID = models.ForeignKey('TBL_Product', on_delete=models.CASCADE,related_name='product_feedback')
    Cust_ID = models.ForeignKey('TBL_Customer_Details', on_delete=models.CASCADE)
    Description = models.CharField(max_length=250,null=False)  # Feedback description
    IsActive = models.CharField(max_length=1, default='1')  # Indicates whether the feedback is active
    Feedback_DateTime = models.DateTimeField(auto_now_add=True)  # Automatically stores creation date and time

    def __str__(self):
        return f'{self.Feedback_ID} - {self.Description}'
