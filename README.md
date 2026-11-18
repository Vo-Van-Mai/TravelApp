# 🌍 TravelApp – Ứng dụng hỗ trợ dịch vụ du lịch

## 1. Giới thiệu dự án

**TravelApp** là ứng dụng di động được phát triển nhằm kết nối khách hàng với các nhà cung cấp dịch vụ du lịch. Hệ thống hỗ trợ người dùng tiếp cận các dịch vụ du lịch thông qua nền tảng di động, đồng thời cung cấp các chức năng quản lý dành cho nhà cung cấp và quản trị viên.

Dự án được xây dựng theo mô hình Client – Server, sử dụng Django REST Framework để phát triển hệ thống API và React Native kết hợp Expo để xây dựng ứng dụng di động đa nền tảng.

## 2. Các đối tượng sử dụng

Hệ thống được thiết kế với 3 nhóm người dùng chính:

| Đối tượng | Mô tả |
|---|---|
| **Admin (Quản trị viên)** | Quản lý và giám sát hoạt động của hệ thống. |
| **Traveler (Khách du lịch)** | Người dùng tìm kiếm và sử dụng các dịch vụ du lịch. |
| **Provider (Nhà cung cấp)** | Đơn vị hoặc cá nhân cung cấp và quản lý dịch vụ du lịch. |

## 3. Công nghệ sử dụng

### Backend
- Python
- Django 5.2.4
- Django REST Framework
- MySQL
- OAuth Toolkit

### Frontend
- React Native 0.79.5
- Expo SDK 53
- JavaScript
- React Native Paper

### Dịch vụ bên thứ ba
- Cloudinary: Lưu trữ và quản lý hình ảnh.
- Expo Location: Hỗ trợ các chức năng liên quan đến vị trí.
- MoMo / VNPay: Nghiên cứu và thử nghiệm tích hợp thanh toán.

### Công cụ phát triển
- Visual Studio Code
- Android Studio
- Git & GitHub
- Expo Go

## 4. Kiến trúc hệ thống

Dự án sử dụng kiến trúc Client – Server, trong đó ứng dụng di động giao tiếp với máy chủ thông qua RESTful API.

```text
       ỨNG DỤNG DI ĐỘNG
        React Native
            Expo
              |
              | HTTP / REST API
              |
       BACKEND SERVER
           Django
     Django REST Framework
       Authentication
              |
        +-----+------+
        |            |
        v            v
      MySQL      Cloudinary
    Database    Media Storage
```

**Mô tả:**
- Frontend: Hiển thị giao diện và xử lý tương tác với người dùng.
- Backend: Xử lý nghiệp vụ, xác thực người dùng và cung cấp API.
- MySQL: Lưu trữ dữ liệu của hệ thống.
- Cloudinary: Hỗ trợ lưu trữ hình ảnh và tài nguyên đa phương tiện.

## 5. Các chức năng chính

Hệ thống được tổ chức theo ba nhóm người dùng:

- Phân quyền và tổ chức chức năng theo vai trò Admin, Traveler và Provider.
- Giao tiếp giữa ứng dụng di động và máy chủ thông qua RESTful API.
- Quản lý và truy xuất dữ liệu thông qua Django REST Framework và MySQL.
- Hỗ trợ tích hợp xác thực thông qua OAuth Toolkit.
- Tích hợp dịch vụ lưu trữ hình ảnh Cloudinary.
- Hỗ trợ các chức năng liên quan đến vị trí thông qua Expo Location.

## 6. Tác giả

**Võ Văn Mãi**

- GitHub: [Vo-Van-Mai](https://github.com/Vo-Van-Mai)

---

*Dự án được thực hiện với mục đích học tập, nghiên cứu và xây dựng sản phẩm thực tế phục vụ Portfolio cá nhân.*
