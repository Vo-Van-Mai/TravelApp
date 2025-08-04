# Travel Mobile App

Ứng dụng di động du lịch với đầy đủ tính năng xem thông tin địa điểm, đánh giá và bình luận.

## Tính năng chính

### 1. Xem chi tiết địa điểm
- Hiển thị thông tin chi tiết về địa điểm
- Hình ảnh gallery với khả năng xem toàn màn hình
- Thông tin địa chỉ, giờ mở cửa, giá vé
- Phân loại theo danh mục và khu vực

### 2. Hệ thống đánh giá (Rating)
- Hiển thị điểm đánh giá trung bình
- Cho phép người dùng đã đăng nhập đánh giá từ 1-5 sao
- Hiển thị tổng số đánh giá
- Cập nhật real-time khi có đánh giá mới

### 3. Hệ thống bình luận (Comments)
- Hiển thị danh sách bình luận của người dùng
- Form thêm bình luận mới (yêu cầu đăng nhập)
- Hiển thị avatar, tên người dùng và thời gian bình luận
- Sắp xếp theo thời gian mới nhất

## Cấu trúc API

### Endpoints
```javascript
// Địa điểm
'places': '/places/',
'placeDetail': (id) => `/places/${id}/`,

// Đánh giá và bình luận
'comments': (placeId) => `/places/${placeId}/comments/`,
'ratings': (placeId) => `/places/${placeId}/ratings/`,
'userRating': (placeId) => `/places/${placeId}/user-rating/`,
```

## Components

### PlaceDetail.js
Component chính hiển thị chi tiết địa điểm với:
- Thông tin cơ bản
- Gallery hình ảnh
- Component Rating
- Component Comment

### Rating.js
Component xử lý đánh giá:
- Hiển thị điểm trung bình
- Cho phép đánh giá (cần đăng nhập)
- Cập nhật real-time

### Comment.js
Component xử lý bình luận:
- Hiển thị danh sách bình luận
- Form thêm bình luận mới
- Avatar và thông tin người dùng

## Cài đặt và chạy

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy ứng dụng:
```bash
npm start
```

## Dependencies chính

- `react-native-paper`: UI components
- `@expo/vector-icons`: Icons
- `@react-native-async-storage/async-storage`: Lưu trữ token
- `axios`: HTTP client
- `react-navigation`: Navigation

## Lưu ý

- Cần đăng nhập để đánh giá và bình luận
- API base URL: `http://192.168.100.229:8000/`
- Hỗ trợ hiển thị hình ảnh từ URL
- Responsive design cho các kích thước màn hình khác nhau 