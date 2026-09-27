# BÁO CÁO HƯỚNG DẪN CÀI ĐẶT & SỬ DỤNG HỆ THỐNG
## DỰ ÁN: FANDOMVERSE — VŨ TRỤ FANDOM CỦA BẠN (TECHWIZ)

---

## 📌 THÔNG TIN CHUNG DỰ ÁN

| Mục | Thông tin chi tiết |
| :--- | :--- |
| **Tên dự án** | **FandomVerse — Vũ Trụ Fandom Của Bạn** |
| **Kỳ thi / Khóa học** | **TechWiz — Web Innovation Unleashed** (Publisher: © Aptech Limited) |
| **Kiến trúc hệ thống** | Single Page Application (SPA) — No-Backend Architecture |
| **Công nghệ nền tảng** | React 18, Vite 5, Bootstrap 5.3, Bootstrap Icons, i18next |
| **Kho mã nguồn (Git Link)** | **[https://github.com/Phuongle2312/FandomVerse-Techwiz.git](https://github.com/Phuongle2312/FandomVerse-Techwiz.git)** |
| **Nhánh chính thức** | `main` (Đã đồng bộ đầy đủ commit từ nhánh `luyenhao`) |

---

## 💻 YÊU CẦU MÔI TRƯỜNG (PREREQUISITES)

Trước khi tiến hành cài đặt, máy tính cần đáp ứng các điều kiện môi trường sau:

1. **Node.js**: Phiên bản **`v18.0.0`** trở lên (Khuyến nghị **`v20.x LTS`** để đạt hiệu năng tối ưu).
   - Kiểm tra bằng lệnh: `node -v`
2. **NPM**: Phiên bản **`v9.0.0`** trở lên (Đi kèm sẵn với Node.js).
   - Kiểm tra bằng lệnh: `npm -v`
3. **Git**: Phiên bản **`v2.30.0`** trở lên.
   - Kiểm tra bằng lệnh: `git --version`
4. **Trình duyệt web**: Google Chrome, Microsoft Edge, Mozilla Firefox hoặc Brave phiên bản mới nhất (hỗ trợ ES6+, Canvas 2D/WebGL & LocalStorage).

---

## ⚙️ HƯỚNG DẪN CÀI ĐẶT & KHỞI CHẠY CHI TIẾT

### Bước 1: Tải mã nguồn từ GitHub (Clone Repository)

Mở cửa sổ dòng lệnh (**Terminal / Command Prompt / PowerShell**) và thực hiện lệnh:

```bash
git clone https://github.com/Phuongle2312/FandomVerse-Techwiz.git
```

Di chuyển vào thư mục dự án vừa tải về:

```bash
cd FandomVerse-Techwiz
```

Kiểm tra nhánh hiện tại đang ở nhánh `main`:

```bash
git branch
# Kết quả hiển thị: * main
```

---

### Bước 2: Cài đặt toàn bộ thư viện & phụ thuộc (Install Dependencies)

Cài đặt các gói thư viện được khai báo trong tệp `package.json`:

```bash
npm install
```

> **Lưu ý**: Lệnh trên sẽ tự động tải các gói vào thư mục `node_modules/`. Quá trình này thường mất từ 30 giây đến 1-2 phút tùy vào tốc độ mạng.

---

### Bước 3: Khởi chạy môi trường phát triển (Development Server)

Sau khi cài đặt xong thư viện, chạy lệnh:

```bash
npm run dev
```

Sau khi khởi chạy thành công, Terminal sẽ hiển thị địa chỉ truy cập:
```text
  VITE v5.4.6  ready in 350 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

👉 Mở trình duyệt và truy cập: **`http://localhost:5173`**

---

### Bước 4: Đóng gói dự án triển khai (Production Build & Preview)

- **Biên dịch & đóng gói tối ưu hóa cho Production**:
  ```bash
  npm run build
  ```
  *Toàn bộ tệp nén HTML, CSS, JavaScript và assets đã tối ưu sẽ được xuất ra thư mục `/dist`.*

- **Kiểm tra chạy thử bản đóng gói (Production Preview)**:
  ```bash
  npm run preview
  ```

- **(Tùy chọn) Chạy script tối ưu hóa hình ảnh**:
  ```bash
  npm run optimize:images
  ```

---

## 📦 BẢNG TỔNG HỢP CÁC THƯ VIỆN ĐƯỢC SỬ DỤNG

### 1. Dependencies chính (Dependencies)
| Tên Thư Viện | Phiên Bản | Mục Đích Sử Dụng Trong Dự Án |
| :--- | :--- | :--- |
| **`react`** | `^18.3.1` | Thư viện lõi xây dựng giao diện người dùng theo Component-based. |
| **`react-dom`** | `^18.3.1` | Cung cấp phương thức render DOM cho React trên trình duyệt. |
| **`react-router-dom`** | `^6.26.2` | Quản lý định tuyến trang dạng Single Page Application với `HashRouter` (`/#/...`), giúp chạy mượt mà trên mọi máy chủ tĩnh và không bị lỗi 404 khi tải lại trang. |
| **`bootstrap`** | `^5.3.3` | Hệ thống lưới Grid System phản hồi (Responsive Grid), Modal, Offcanvas và các tiện ích CSS. |
| **`bootstrap-icons`** | `^1.11.3` | Bộ icon vector phong phú hiển thị cho nút bấm, trạng thái, thẻ bài và danh mục. |
| **`i18next`** | `^26.4.2` | Công cụ quốc tế hóa hỗ trợ đa ngôn ngữ. |
| **`react-i18next`** | `^17.0.15` | Cầu nối tích hợp i18next vào React, hỗ trợ dịch chuyển tức thì giữa **Tiếng Việt 🇻🇳**, **Tiếng Anh 🇬🇧** và **Tiếng Hindi 🇮🇳**. |

### 2. Thư viện công cụ phát triển (DevDependencies)
| Tên Thư Viện | Phiên Bản | Mục Đích Sử Dụng |
| :--- | :--- | :--- |
| **`vite`** | `^5.4.6` | Trình đóng gói (bundler) siêu tốc, hỗ trợ Hot Module Replacement (HMR). |
| **`@vitejs/plugin-react`**| `^4.3.1` | Plugin chính thức hỗ trợ JSX Fast Refresh cho React trên nền Vite. |
| **`sharp`** | `^0.35.4` | Thư viện nén và chuyển đổi định dạng hình ảnh sang WebP chất lượng cao. |

---

## 🔑 DANH SÁCH TÀI KHOẢN ĐĂNG NHẬP MẪU

Dự án cung cấp sẵn 2 tài khoản mẫu phục vụ chấm thi và đánh giá:

### 1. Tài khoản Quản trị viên (Admin Portal)
- **Đường dẫn truy cập:** `http://localhost:5173/#/admin/login` (Hoặc chọn mục *Admin* trên thanh điều hướng)
- **Email đăng nhập:** `admin@gmail.com`
- **Mật khẩu:** `admin123`
- **Họ và tên:** Trần Quản Trị (Administrator)
- **Quyền hạn:** Truy cập toàn bộ giao diện quản trị Admin CMS, chỉnh sửa / thêm / xóa nội dung, bài viết, nhân vật, sự kiện, trailer, sản phẩm lưu niệm, quản lý người dùng và cấu hình hệ thống.
- **Tiện ích:** Có sẵn nút bấm **"Tự động điền tài khoản quản trị"** để đăng nhập nhanh với 1 cú click chuột.

### 2. Tài khoản Người dùng trải nghiệm (Demo Fan User)
- **Đường dẫn truy cập:** `http://localhost:5173/#/login`
- **Email đăng nhập:** `demo@fandomverse.io`
- **Mật khẩu:** `demo1234`
- **Họ và tên:** Fan Demo
- **Quyền hạn:** Trải nghiệm đầy đủ các tính năng người dùng: Lưu bài viết yêu thích (Bookmarks), thêm sản phẩm vào Giỏ hàng (Cart), Đặt hàng (Checkout), xem Lịch sử đơn hàng (Orders History), Ghi chú phiên làm việc (Session Notes) và chỉnh sửa thông tin cá nhân.

---

## 📖 HƯỚNG DẪN SỬ DỤNG CÁC CHỨC NĂNG DỰ ÁN

### I. DÀNH CHO NGƯỜI DÙNG ĐẠI CHÚNG (END-USER)

#### 1. Trang chủ (Home Page — `/#/`)
- **Banner Cinema Hero:** Trình chiếu các hình ảnh và thông tin nổi bật với hiệu ứng thị giác hiện đại.
- **7 Vũ trụ Fandom:** Truy cập nhanh vào 7 danh mục chuyên sâu (Anime, Gaming, Movies, TV Shows, K-Pop, Comics, Manga).
- **Đồng hồ thời gian thực & Bộ đếm khách:** Hiển thị thời gian trực tiếp và bộ đếm lượt truy cập thời gian thực.
- **Khám phá nhanh:** Nhân vật tiêu biểu, sự kiện sắp diễn ra và sản phẩm bán chạy nhất.

#### 2. Khám phá 7 Phân khu Fandom (`/#/category/:categoryId`)
- Mỗi danh mục sở hữu màu sắc chủ đạo và **hiệu ứng tương tác Canvas độc quyền**:
  - 🌸 **Anime:** Hiệu ứng mưa cánh hoa anh đào (Sakura Petals).
  - ⚡ **Gaming:** Tinh thể Hextech lơ lửng & tia năng lượng ma thuật.
  - 🐉 **TV Shows:** Tàn tro rồng lửa (Dragon Fire Embers) phong cách House of the Dragon.
  - ✨ **K-Pop:** Ánh đèn sân khấu Idol Stage, pháo hoa & que phát sáng Lightstick.
  - 🎬 **Movies:** Dải ánh sáng máy chiếu phim rạp cổ điển (Film Grain & Light Rays).
  - 🕸️ **Comics:** Mạng nhện tơ Spider-Web và tia phóng xạ siêu anh hùng.
  - 💥 **Manga:** Vệt gió tốc độ hành động (Speedlines Action).
- **Nút bật/tắt hiệu ứng:** Người dùng có thể nhấn công tắc ở góc trên để bật/tắt hiệu ứng nhằm tiết kiệm pin hoặc tối ưu hóa cho máy cấu hình yếu. Hệ thống tự động tạm dừng render khi người dùng chuyển tab hoặc cuộn qua khỏi màn hình hiển thị.

#### 3. Chi tiết Nội dung & Nhân vật (`/#/content/:id`)
- Đọc bài viết phân tích chuyên sâu về tác phẩm.
- **Thư viện ảnh tương tác (Lightbox):** Nhấp vào hình ảnh để xem toàn màn hình với độ phân giải cao.
- **Hồ sơ nhân vật & Sự kiện liên quan:** Xem chỉ số sức mạnh, ngày sinh, diễn viên lồng tiếng, địa điểm tổ chức.
- **Lưu yêu thích (Bookmark):** Nhấn biểu tượng ngôi sao/trái tim để lưu vào danh sách xem sau (lưu trữ bằng `localStorage`).

#### 4. Thư viện Trailer Đa phương tiện (`/#/trailers`)
- Xem trailer chính thức chuẩn HD nhúng từ YouTube mà không bị gián đoạn.
- Bộ lọc trailer theo từng danh mục Fandom (Anime, Gaming, Movies, K-Pop,...).
- Xem thông tin ngày phát hành, thời lượng và tóm tắt nội dung video.

#### 5. Cửa hàng Quà lưu niệm & Giỏ hàng (`/#/merchandise`)
- Khám phá các mặt hàng chính hãng: Áo thun, Mô hình (Figure), Lightstick, Poster, Phụ kiện.
- **Bộ lọc thông minh:** Lọc theo danh mục, mức giá từ thấp đến cao, sản phẩm giảm giá hoặc đánh giá sao cao nhất.
- **Giỏ hàng trực quan (Cart Drawer):**
  - Thêm sản phẩm vào giỏ với thông báo Toast tức thì.
  - Điều chỉnh số lượng (+/-) hoặc xóa mặt hàng trong giỏ.
  - Tự động tính toán tổng phụ, phí vận chuyển và áp dụng mã giảm giá.

#### 6. Quy trình Đặt hàng (Checkout — `/#/checkout`)
- Nhập thông tin người nhận hàng: Họ tên, Số điện thoại, Địa chỉ giao hàng, Ghi chú.
- Chọn phương thức thanh toán: Thanh toán khi nhận hàng (COD), Chuyển khoản ngân hàng hoặc Thẻ tín dụng.
- Nhập mã giảm giá ưu đãi (Ví dụ: `FANDOM10` giảm 10%, `FREESHIP` miễn phí vận chuyển).
- Xác nhận đơn hàng thành công và hệ thống tự động ghi nhận vào trang **Lịch sử đơn hàng** (`/#/orders-history`).

#### 7. Tìm kiếm toàn cục (Global Search — `/#/search?q=...`)
- Thanh tìm kiếm tức thì nằm trên Navbar cho phép tra cứu ngay lập tức theo từ khóa.
- Phân loại kết quả rõ ràng: Bài viết, Nhân vật, Sự kiện, Sản phẩm, Trailer.

#### 8. Trợ lý ảo AI Chatbot (Widget góc dưới bên phải)
- Hỗ trợ trả lời tự động các câu hỏi thường gặp (FAQ) 24/7.
- Gợi ý điều hướng nhanh: Bấm vào câu trả lời để chuyển thẳng tới danh mục Anime, Cửa hàng hoặc Hướng dẫn mua hàng.

#### 9. Chuyển đổi ngôn ngữ đa quốc gia (i18n)
- Nút chọn ngôn ngữ nằm trên thanh Menu trên cùng.
- Hỗ trợ chuyển đổi nhanh chóng giữa **Tiếng Việt 🇻🇳**, **English 🇬🇧** và **Hindi 🇮🇳** mà không cần tải lại trang.

---

### II. DÀNH CHO QUẢN TRỊ VIÊN (ADMIN CMS)

Sau khi đăng nhập tại `/#/admin/login`, Quản trị viên có toàn quyền truy cập các mô-đun:

1. **Dashboard Tổng quan (`/#/admin`):**
   - Thống kê thời gian thực tổng số Bài viết, Nhân vật, Sự kiện, Trailer, Sản phẩm, Đơn hàng và Người dùng.
   - Biểu đồ xu hướng tương tác và các hoạt động gần đây.
2. **Quản lý Nội dung Fandom (`/#/admin/contents`):**
   - Xem danh sách bảng dữ liệu đầy đủ.
   - Thêm mới bài viết: Tiêu đề, danh mục, tóm tắt, ảnh bìa, nội dung chi tiết.
   - Chỉnh sửa thông tin bài viết và Xóa bài viết với hộp thoại xác nhận an toàn.
3. **Quản lý Nhân vật (`/#/admin/characters`):**
   - Thêm hồ sơ nhân vật, hình ảnh đại diện, danh mục, thông số kỹ năng, câu trích dẫn nổi tiếng.
4. **Quản lý Sự kiện (`/#/admin/events`):**
   - Quản lý lịch trình lễ hội, concert, comic con, giải đấu eSports, thời gian bắt đầu/kết thúc và trạng thái (Sắp diễn ra, Đang diễn ra, Đã kết thúc).
5. **Quản lý Trailers (`/#/admin/trailers`):**
   - Cập nhật mã nhúng YouTube video, tiêu đề, danh mục và ngày ra mắt.
6. **Quản lý Sản phẩm Quà lưu niệm (`/#/admin/merchandise`):**
   - Thêm mới sản phẩm, cập nhật giá bán, phần trăm giảm giá, số lượng tồn kho và trạng thái còn hàng/hết hàng.
7. **Quản lý Người dùng (`/#/admin/users`):**
   - Xem danh sách tài khoản đã đăng ký trong hệ thống, phân quyền vai trò (Admin hoặc User).
8. **Cài đặt & Khôi phục dữ liệu (`/#/admin/settings`):**
   - Nút **"Khôi phục dữ liệu mẫu gốc (Reset to Default)"**: Đưa toàn bộ cơ sở dữ liệu về trạng thái ban đầu của ban tổ chức.
   - Xuất/Nhập dữ liệu dự phòng dạng JSON.

---

## 📁 CẤU TRÚC THƯ MỤC NGUỒN (PROJECT STRUCTURE)

```text
FandomVerse-Techwiz/
├── public/                     # Tài nguyên tĩnh công khai (Logo, Favicon, Videos, Posters)
│   ├── assets/                 # Hình ảnh sản phẩm, nhân vật, sự kiện, video nền
│   └── favicon.svg             # Biểu tượng website
├── src/                        # Mã nguồn chính của ứng dụng
│   ├── components/             # Các thành phần tái sử dụng
│   │   ├── common/             # Navbar, Footer, Breadcrumb, Toast, ScrollToTop
│   │   └── interactive/        # Chatbot, CartDrawer, 7 Canvas Effect Component
│   ├── context/                # Quản lý trạng thái toàn cục (Auth, Cart, Bookmark, Theme, Language)
│   ├── data/                   # 6 tệp cơ sở dữ liệu JSON gốc (Contents, Characters, Events,...)
│   ├── hooks/                  # Custom React Hooks (useDebounce, useVideoVisibilityAutoplay)
│   ├── i18n/                   # Cấu hình đa ngôn ngữ (vi, en, hi)
│   ├── pages/                  # Các trang người dùng (Home, Category, ContentDetail, Cart, Checkout,...)
│   │   └── admin/              # Toàn bộ trang giao diện Quản trị viên (CMS)
│   ├── services/               # Dịch vụ lưu trữ StorageService, DataService
│   ├── styles/                 # Tệp định kiểu CSS (global.css, admin.css, effects.css)
│   ├── App.jsx                 # Bộ định tuyến trung tâm (HashRouter)
│   └── main.jsx                # Điểm khởi chạy của ứng dụng React
├── index.html                  # Khung trang đơn Single Page Application
├── package.json                # Khai báo phụ thuộc thư viện và scripts khởi chạy
├── vite.config.js              # Cấu hình trình đóng gói Vite
└── README.md                   # Giới thiệu tổng quan dự án
```

---

## 🛠️ XỬ LÝ SỰ CỐ THƯỜNG GẶP (TROUBLESHOOTING)

| Hiện tượng | Nguyên nhân | Cách khắc phục |
| :--- | :--- | :--- |
| **Báo lỗi trùng cổng `Port 5173 is in use`** | Đang có một ứng dụng hoặc terminal khác chạy cổng 5173. | Vite sẽ tự động gợi ý chuyển sang cổng `5174` (truy cập `http://localhost:5174`), hoặc tắt tiến trình cũ bằng Task Manager. |
| **Không tải được thư viện khi chạy `npm install`** | Mạng chập chờn hoặc cache npm cũ bị lỗi. | Chạy `npm cache clean --force` rồi thực hiện lại lệnh `npm install`. |
| **Dữ liệu chỉnh sửa không thấy hiển thị** | Do trình duyệt lưu cache trạng thái cũ. | Nhấn `Ctrl + F5` (hoặc `Cmd + Shift + R`) để tải lại toàn diện, hoặc vào `/#/admin/settings` bấm Reset dữ liệu. |
| **Video YouTube không phát được** | Kết nối mạng bị chặn hoặc video bị giới hạn quyền riêng tư bởi tác giả. | Kiểm tra kết nối Internet hoặc thử chọn trailer khác trong danh mục. |
| **Máy cấu hình yếu bị khựng hình** | Các hiệu ứng hạt tương tác Canvas đang chạy ở tần số quét cao. | Nhấn vào công tắc **Tắt hiệu ứng** ở đầu trang chuyên mục; hệ thống đã tích hợp cơ chế tự động tạm dừng khi rời tab hoặc cuộn qua màn hình. |

---

> **Báo cáo được hoàn thiện và xác thực 100% trên mã nguồn nhánh chính thức của dự án FandomVerse.**
