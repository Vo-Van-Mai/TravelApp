# Thay đổi Component Rating

## 🎯 Mục tiêu
Cải thiện component Rating để hiển thị rõ ràng trạng thái đánh giá của người dùng và cho phép thay đổi đánh giá.

## 📋 Các thay đổi chính

### 1. **Trạng thái hiển thị rõ ràng**

#### **Trường hợp 1: Chưa đăng nhập**
```
┌─────────────────────────────────┐
│ Đăng nhập để đánh giá          │
│ Vui lòng đăng nhập để có thể   │
│ đánh giá địa điểm này          │
└─────────────────────────────────┘
```

#### **Trường hợp 2: Đã đăng nhập nhưng chưa đánh giá**
```
┌─────────────────────────────────┐
│ Đánh giá của bạn:              │
│ ⭐⭐⭐⭐⭐ (0 sao)              │
│ Chưa đánh giá                  │
│ Nhấn vào sao để đánh giá      │
└─────────────────────────────────┘
```

#### **Trường hợp 3: Đã đánh giá rồi**
```
┌─────────────────────────────────┐
│ Đánh giá của bạn:              │
│ ⭐⭐⭐⭐⭐ (4 sao)              │
│ Bạn đã đánh giá 4 sao         │
│ Ngày: 15/12/2024               │
│ Nhấn vào sao để thay đổi      │
│ đánh giá                       │
└─────────────────────────────────┘
```

### 2. **Tính năng mới**

#### **Interactive Stars**
- ✅ Hiển thị rating tạm thời khi hover (onPressIn/onPressOut)
- ✅ Cho phép thay đổi đánh giá nếu đã đánh giá rồi
- ✅ Hiển thị ngày đánh giá

#### **Better UX**
- ✅ Text hướng dẫn rõ ràng cho từng trường hợp
- ✅ Loading states và error handling
- ✅ Auto refresh sau khi đánh giá

### 3. **Code Changes**

#### **State Management**
```javascript
// Thêm tempRating để hiển thị rating tạm thời
const [tempRating, setTempRating] = useState(0);
```

#### **Render Function**
```javascript
const renderUserRatingSection = () => {
    if (!user) {
        // Hiển thị thông báo đăng nhập
    } else if (userRating) {
        // Hiển thị đánh giá hiện tại + cho phép thay đổi
    } else {
        // Hiển thị form đánh giá mới
    }
};
```

#### **Interactive Stars**
```javascript
const renderStars = (rating, interactive = false, onPress = null, showTemp = false) => {
    const displayRating = showTemp ? tempRating : rating;
    
    return (
        <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
                <MaterialIcons
                    key={star}
                    name={star <= displayRating ? "star" : "star-border"}
                    size={24}
                    color={star <= displayRating ? "#FFD700" : "#ccc"}
                    style={styles.star}
                    onPress={interactive ? () => onPress(star) : null}
                    onPressIn={interactive ? () => setTempRating(star) : null}
                    onPressOut={interactive ? () => setTempRating(0) : null}
                />
            ))}
        </View>
    );
};
```

### 4. **Styles mới**

```javascript
// Thêm vào PlaceStyle.js
loginHint: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginTop: 5,
    fontStyle: "italic",
},
ratingDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 3,
},
changeRatingHint: {
    fontSize: 12,
    color: "#2196F3",
    marginTop: 5,
    fontStyle: "italic",
},
rateHint: {
    fontSize: 12,
    color: "#2196F3",
    marginTop: 5,
    fontStyle: "italic",
},
```

### 5. **API Endpoints**

```javascript
// Đã có sẵn trong Apis.js
'ratings': (placeId) => `/places/${placeId}/get-rating/`,
'averageRating': (placeId) => `/places/${placeId}/get-average-rating/`,
```

## 🚀 Kết quả

### **Trước khi thay đổi:**
- ❌ Không rõ user đã đánh giá hay chưa
- ❌ Không có hướng dẫn rõ ràng
- ❌ Không thể thay đổi đánh giá

### **Sau khi thay đổi:**
- ✅ Hiển thị rõ ràng trạng thái đánh giá
- ✅ Hướng dẫn chi tiết cho từng trường hợp
- ✅ Cho phép thay đổi đánh giá
- ✅ Hiển thị ngày đánh giá
- ✅ Interactive stars với hover effect
- ✅ Better error handling và loading states

## 🧪 Test Cases

1. **Chưa đăng nhập** → Hiển thị thông báo đăng nhập
2. **Đã đăng nhập, chưa đánh giá** → Hiển thị form đánh giá
3. **Đã đánh giá rồi** → Hiển thị đánh giá hiện tại + cho phép thay đổi
4. **Thay đổi đánh giá** → Cập nhật real-time
5. **Error handling** → Hiển thị thông báo lỗi phù hợp

## 📱 Screenshots

### Trường hợp chưa đăng nhập:
```
┌─────────────────────────────────┐
│           Đánh giá             │
│                                │
│           4.2 ⭐⭐⭐⭐⭐         │
│         (15 đánh giá)         │
│                                │
│      ───────────────────       │
│                                │
│      Đăng nhập để đánh giá    │
│   Vui lòng đăng nhập để có    │
│   thể đánh giá địa điểm này   │
└─────────────────────────────────┘
```

### Trường hợp đã đánh giá:
```
┌─────────────────────────────────┐
│           Đánh giá             │
│                                │
│           4.2 ⭐⭐⭐⭐⭐         │
│         (15 đánh giá)         │
│                                │
│      ───────────────────       │
│                                │
│      Đánh giá của bạn:        │
│        ⭐⭐⭐⭐⭐ (4 sao)       │
│   Bạn đã đánh giá 4 sao      │
│        Ngày: 15/12/2024       │
│   Nhấn vào sao để thay đổi    │
│        đánh giá               │
└─────────────────────────────────┘
``` 