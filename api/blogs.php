<?php
/**
 * HomeAds (homeads.ae) - Blogs Backend API
 * Supports CRUD, JSON storage, image upload, and admin authentication.
 */

session_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

define('ADMIN_PASSWORD', 'Homeads@2026');
define('DATA_FILE', dirname(__DIR__) . '/data/blogs.json');
define('UPLOAD_DIR', dirname(__DIR__) . '/assets/uploads/');

function sendJson($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function isAdmin() {
    if (!empty($_SESSION['homeads_admin']) && $_SESSION['homeads_admin'] === true) {
        return true;
    }
    // Check Authorization header for simple token
    $headers = getallheaders();
    $auth = isset($headers['Authorization']) ? trim($headers['Authorization']) : '';
    if ($auth === 'Bearer ' . md5(ADMIN_PASSWORD)) {
        return true;
    }
    return false;
}

function getBlogs() {
    if (!file_exists(DATA_FILE)) {
        return [];
    }
    $content = file_get_contents(DATA_FILE);
    $data = json_decode($content, true);
    return is_array($data) ? $data : [];
}

function saveBlogs($blogs) {
    $dir = dirname(DATA_FILE);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    return file_put_contents(DATA_FILE, json_encode($blogs, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
}

$action = isset($_GET['action']) ? trim($_GET['action']) : '';

// 1. LOGIN
if ($action === 'login') {
    $input = json_decode(file_get_contents('php://input'), true);
    $password = isset($input['password']) ? trim($input['password']) : '';
    if ($password === ADMIN_PASSWORD) {
        $_SESSION['homeads_admin'] = true;
        sendJson([
            'success' => true,
            'message' => 'Login successful',
            'token' => md5(ADMIN_PASSWORD)
        ]);
    } else {
        sendJson(['success' => false, 'message' => 'Invalid admin password'], 401);
    }
}

// 2. CHECK AUTH
if ($action === 'check_auth') {
    sendJson(['authenticated' => isAdmin()]);
}

// 3. LOGOUT
if ($action === 'logout') {
    $_SESSION['homeads_admin'] = false;
    session_destroy();
    sendJson(['success' => true, 'message' => 'Logged out successfully']);
}

// 4. LIST BLOGS
if ($action === 'list' || $action === '') {
    $blogs = getBlogs();
    $admin = isAdmin();
    $category = isset($_GET['category']) ? trim($_GET['category']) : '';
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';

    $result = [];
    foreach ($blogs as $b) {
        if (!$admin && (!isset($b['status']) || $b['status'] !== 'published')) {
            continue;
        }
        if ($category && strcasecmp($category, 'all') !== 0 && strcasecmp($b['category'], $category) !== 0) {
            continue;
        }
        if ($search) {
            $haystack = strtolower($b['title'] . ' ' . $b['excerpt'] . ' ' . $b['category']);
            if (strpos($haystack, strtolower($search)) === false) {
                continue;
            }
        }
        $result[] = $b;
    }
    sendJson(['success' => true, 'blogs' => $result, 'isAdmin' => $admin]);
}

// 5. GET SINGLE BLOG
if ($action === 'get') {
    $id = isset($_GET['id']) ? trim($_GET['id']) : '';
    $slug = isset($_GET['slug']) ? trim($_GET['slug']) : '';
    $blogs = getBlogs();
    $admin = isAdmin();

    foreach ($blogs as $b) {
        if (($id && $b['id'] === $id) || ($slug && $b['slug'] === $slug)) {
            if (!$admin && (!isset($b['status']) || $b['status'] !== 'published')) {
                sendJson(['success' => false, 'message' => 'Blog not found or draft'], 404);
            }
            sendJson(['success' => true, 'blog' => $b]);
        }
    }
    sendJson(['success' => false, 'message' => 'Blog not found'], 404);
}

// Require admin for mutations
if (!isAdmin()) {
    sendJson(['success' => false, 'message' => 'Unauthorized. Admin login required.'], 403);
}

// 6. SAVE / CREATE / UPDATE BLOG
if ($action === 'save') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input || empty($input['title'])) {
        sendJson(['success' => false, 'message' => 'Title is required'], 400);
    }

    $blogs = getBlogs();
    $id = !empty($input['id']) ? trim($input['id']) : 'blog-' . time() . '-' . rand(100, 999);
    
    // Generate slug if empty
    $slug = !empty($input['slug']) ? trim($input['slug']) : strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $input['title']), '-'));

    $newBlog = [
        'id' => $id,
        'slug' => $slug,
        'title' => trim($input['title']),
        'category' => !empty($input['category']) ? trim($input['category']) : 'Real Estate',
        'author' => !empty($input['author']) ? trim($input['author']) : 'HomeAds Team',
        'date' => !empty($input['date']) ? trim($input['date']) : date('F j, Y'),
        'readTime' => !empty($input['readTime']) ? trim($input['readTime']) : '4 min read',
        'coverImage' => !empty($input['coverImage']) ? trim($input['coverImage']) : 'assets/landing-bg.png',
        'excerpt' => !empty($input['excerpt']) ? trim($input['excerpt']) : '',
        'content' => !empty($input['content']) ? $input['content'] : '',
        'status' => (!empty($input['status']) && $input['status'] === 'draft') ? 'draft' : 'published'
    ];

    $foundIndex = -1;
    foreach ($blogs as $idx => $item) {
        if ($item['id'] === $id) {
            $foundIndex = $idx;
            break;
        }
    }

    if ($foundIndex >= 0) {
        $blogs[$foundIndex] = $newBlog;
    } else {
        array_unshift($blogs, $newBlog); // Add new blog to top
    }

    saveBlogs($blogs);
    sendJson(['success' => true, 'message' => 'Blog saved successfully', 'blog' => $newBlog]);
}

// 7. DELETE BLOG
if ($action === 'delete') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = !empty($input['id']) ? trim($input['id']) : '';
    if (!$id) {
        sendJson(['success' => false, 'message' => 'Blog ID required'], 400);
    }

    $blogs = getBlogs();
    $filtered = [];
    $found = false;
    foreach ($blogs as $item) {
        if ($item['id'] === $id) {
            $found = true;
            continue;
        }
        $filtered[] = $item;
    }

    if (!$found) {
        sendJson(['success' => false, 'message' => 'Blog not found'], 404);
    }

    saveBlogs($filtered);
    sendJson(['success' => true, 'message' => 'Blog deleted successfully']);
}

// 8. IMAGE UPLOAD
if ($action === 'upload') {
    if (empty($_FILES['image'])) {
        sendJson(['success' => false, 'message' => 'No image file uploaded'], 400);
    }
    $file = $_FILES['image'];
    $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    if (!in_array($ext, $allowed)) {
        sendJson(['success' => false, 'message' => 'Invalid file type. Allowed: jpg, png, webp, gif, svg'], 400);
    }

    if (!is_dir(UPLOAD_DIR)) {
        mkdir(UPLOAD_DIR, 0755, true);
    }

    $filename = 'blog_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
    $target = UPLOAD_DIR . $filename;

    if (move_uploaded_file($file['tmp_name'], $target)) {
        sendJson([
            'success' => true,
            'url' => 'assets/uploads/' . $filename,
            'filename' => $filename
        ]);
    } else {
        sendJson(['success' => false, 'message' => 'Failed to save uploaded image'], 500);
    }
}

sendJson(['success' => false, 'message' => 'Unknown action'], 400);
