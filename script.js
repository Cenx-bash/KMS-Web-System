// KMS Application Class
class KnowledgeManagementSystem {
    constructor() {
        this.articles = JSON.parse(localStorage.getItem('kms_articles')) || this.getDefaultArticles();
        this.categories = JSON.parse(localStorage.getItem('kms_categories')) || this.getDefaultCategories();
        this.currentPage = 1;
        this.articlesPerPage = 5;
        this.editingArticleId = null;
        this.filterCategory = 'all';
        
        this.initializeApp();
    }
    
    // Initialize the application
    initializeApp() {
        this.setupEventListeners();
        this.loadCategories();
        this.loadArticles();
        this.updateStats();
        this.updatePagination();
    }
    
    // Get default articles for initial setup
    getDefaultArticles() {
        return [
            {
                id: 1,
                title: "Getting Started with Our Platform",
                category: "Getting Started",
                author: "John Smith",
                lastUpdated: "2023-05-15",
                views: 342,
                status: "published",
                content: "This guide will help you get started with our platform. Follow these steps to set up your account and begin using our services.",
                tags: ["onboarding", "setup", "tutorial"]
            },
            {
                id: 2,
                title: "User Account Management Guide",
                category: "User Guides",
                author: "Sarah Johnson",
                lastUpdated: "2023-05-12",
                views: 218,
                status: "published",
                content: "Learn how to manage your user account, update profile information, change passwords, and configure notification settings.",
                tags: ["account", "profile", "settings"]
            },
            {
                id: 3,
                title: "Troubleshooting Common Login Issues",
                category: "Troubleshooting",
                author: "Michael Brown",
                lastUpdated: "2023-05-10",
                views: 156,
                status: "published",
                content: "Having trouble logging in? This article covers the most common login issues and how to resolve them.",
                tags: ["login", "authentication", "issues"]
            },
            {
                id: 4,
                title: "Best Practices for Data Security",
                category: "Best Practices",
                author: "Emily Davis",
                lastUpdated: "2023-05-08",
                views: 89,
                status: "draft",
                content: "Follow these best practices to ensure your data remains secure while using our platform.",
                tags: ["security", "best practices", "data protection"]
            },
            {
                id: 5,
                title: "Company Privacy Policy Update",
                category: "Policies",
                author: "Robert Wilson",
                lastUpdated: "2023-05-05",
                views: 421,
                status: "published",
                content: "We've updated our privacy policy to better protect your data and comply with new regulations.",
                tags: ["policy", "privacy", "compliance"]
            },
            {
                id: 6,
                title: "Advanced Feature Overview",
                category: "User Guides",
                author: "Lisa Anderson",
                lastUpdated: "2023-05-03",
                views: 127,
                status: "published",
                content: "Explore the advanced features of our platform to get the most out of your experience.",
                tags: ["features", "advanced", "guide"]
            },
            {
                id: 7,
                title: "API Integration Guide",
                category: "User Guides",
                author: "David Miller",
                lastUpdated: "2023-05-01",
                views: 94,
                status: "draft",
                content: "Learn how to integrate our API into your applications and automate workflows.",
                tags: ["api", "integration", "development"]
            },
            {
                id: 8,
                title: "Performance Optimization Tips",
                category: "Best Practices",
                author: "Jennifer Lee",
                lastUpdated: "2023-04-28",
                views: 203,
                status: "published",
                content: "Optimize your usage of our platform for better performance and efficiency.",
                tags: ["performance", "optimization", "tips"]
            }
        ];
    }
    
    // Get default categories
    getDefaultCategories() {
        return [
            { id: 1, name: "Getting Started", count: 1 },
            { id: 2, name: "User Guides", count: 3 },
            { id: 3, name: "Troubleshooting", count: 1 },
            { id: 4, name: "Best Practices", count: 2 },
            { id: 5, name: "Policies", count: 1 }
        ];
    }
    
    // Set up event listeners
    setupEventListeners() {
        // Add article button
        document.getElementById('addArticleBtn').addEventListener('click', () => {
            this.openAddArticleModal();
        });
        
        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModals();
            });
        });
        
        // Cancel article button
        document.getElementById('cancelArticleBtn').addEventListener('click', () => {
            this.closeModals();
        });
        
        // Form submission
        document.getElementById('articleForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveArticle();
        });
        
        // Pagination buttons
        document.getElementById('prevPageBtn').addEventListener('click', () => {
            this.previousPage();
        });
        
        document.getElementById('nextPageBtn').addEventListener('click', () => {
            this.nextPage();
        });
        
        // Search input
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchArticles(e.target.value);
        });
        
        // Filter and export buttons
        document.getElementById('filterBtn').addEventListener('click', () => {
            this.showFilterOptions();
        });
        
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportArticles();
        });
        
        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModals();
                }
            });
        });
        
        // Mobile menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
            });
        }
    }
    
    // Load categories into the sidebar
    loadCategories() {
        const categoriesList = document.getElementById('categoriesList');
        categoriesList.innerHTML = '';
        
        // Add "All Categories" option
        const allItem = document.createElement('li');
        allItem.innerHTML = `
            <a class="${this.filterCategory === 'all' ? 'active' : ''}" data-category="all">
                <i class="fas fa-folder-open"></i> All Articles
            </a>
        `;
        allItem.querySelector('a').addEventListener('click', (e) => {
            this.filterByCategory('all');
            this.setActiveCategory(e.target);
        });
        categoriesList.appendChild(allItem);
        
        // Add each category
        this.categories.forEach(category => {
            const item = document.createElement('li');
            item.innerHTML = `
                <a class="${this.filterCategory === category.id ? 'active' : ''}" data-category="${category.id}">
                    <i class="fas fa-folder"></i> ${category.name} (${category.count})
                </a>
            `;
            item.querySelector('a').addEventListener('click', (e) => {
                this.filterByCategory(category.id);
                this.setActiveCategory(e.target);
            });
            categoriesList.appendChild(item);
        });
        
        // Populate category dropdown in form
        const categorySelect = document.getElementById('articleCategory');
        categorySelect.innerHTML = '<option value="">Select a category</option>';
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    }
    
    // Set active category in sidebar
    setActiveCategory(clickedElement) {
        document.querySelectorAll('#categoriesList a').forEach(a => {
            a.classList.remove('active');
        });
        clickedElement.classList.add('active');
    }
    
    // Filter articles by category
    filterByCategory(categoryId) {
        this.filterCategory = categoryId;
        this.currentPage = 1;
        this.loadArticles();
        this.updatePagination();
    }
    
    // Load articles into the table
    loadArticles() {
        const articlesTableBody = document.getElementById('articlesTableBody');
        articlesTableBody.innerHTML = '';
        
        // Filter articles based on category
        let filteredArticles = this.articles;
        if (this.filterCategory !== 'all') {
            const categoryName = this.categories.find(c => c.id == this.filterCategory)?.name;
            filteredArticles = this.articles.filter(article => article.category === categoryName);
        }
        
        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.articlesPerPage;
        const endIndex = startIndex + this.articlesPerPage;
        const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
        
        if (paginatedArticles.length === 0) {
            articlesTableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px;">
                        <i class="fas fa-inbox" style="font-size: 48px; color: #dee2e6; margin-bottom: 16px;"></i>
                        <p>No articles found</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        // Populate table with articles
        paginatedArticles.forEach(article => {
            const row = document.createElement('tr');
            
            // Format the date
            const formattedDate = new Date(article.lastUpdated).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            row.innerHTML = `
                <td>
                    <div class="article-title" data-id="${article.id}">${article.title}</div>
                </td>
                <td>${article.category}</td>
                <td>
                    <div class="author-info">
                        <span>${article.author}</span>
                    </div>
                </td>
                <td>${formattedDate}</td>
                <td>${article.views}</td>
                <td>
                    <span class="status ${article.status}">${article.status.charAt(0).toUpperCase() + article.status.slice(1)}</span>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn view" data-id="${article.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" data-id="${article.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" data-id="${article.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            articlesTableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        this.attachArticleEventListeners();
    }
    
    // Attach event listeners to article action buttons
    attachArticleEventListeners() {
        // View article
        document.querySelectorAll('.action-btn.view').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const articleId = e.currentTarget.getAttribute('data-id');
                this.viewArticle(articleId);
            });
        });
        
        // Edit article
        document.querySelectorAll('.action-btn.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const articleId = e.currentTarget.getAttribute('data-id');
                this.editArticle(articleId);
            });
        });
        
        // Delete article
        document.querySelectorAll('.action-btn.delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const articleId = e.currentTarget.getAttribute('data-id');
                this.deleteArticle(articleId);
            });
        });
        
        // View article by clicking title
        document.querySelectorAll('.article-title').forEach(title => {
            title.addEventListener('click', (e) => {
                const articleId = e.currentTarget.getAttribute('data-id');
                this.viewArticle(articleId);
            });
        });
    }
    
    // Open add article modal
    openAddArticleModal() {
        this.editingArticleId = null;
        document.getElementById('modalTitle').textContent = 'Create New Article';
        document.getElementById('articleForm').reset();
        document.getElementById('addArticleModal').classList.add('active');
    }
    
    // View article
    viewArticle(id) {
        const article = this.articles.find(a => a.id == id);
        if (!article) return;
        
        // Update view count
        article.views++;
        this.saveToLocalStorage();
        
        // Populate view modal
        document.getElementById('viewArticleTitle').textContent = article.title;
        document.getElementById('viewArticleCategory').textContent = article.category;
        document.getElementById('viewArticleAuthor').textContent = article.author;
        document.getElementById('viewArticleDate').textContent = new Date(article.lastUpdated).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('viewArticleViews').textContent = article.views;
        document.getElementById('viewArticleContent').textContent = article.content;
        
        // Display tags
        const tagsContainer = document.getElementById('viewArticleTags');
        tagsContainer.innerHTML = '';
        if (article.tags && article.tags.length > 0) {
            article.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'tag';
                tagElement.textContent = tag;
                tagsContainer.appendChild(tagElement);
            });
        }
        
        // Show view modal
        document.getElementById('viewArticleModal').classList.add('active');
        
        // Update stats
        this.updateStats();
    }
    
    // Edit article
    editArticle(id) {
        const article = this.articles.find(a => a.id == id);
        if (!article) return;
        
        this.editingArticleId = id;
        document.getElementById('modalTitle').textContent = 'Edit Article';
        document.getElementById('articleTitle').value = article.title;
        document.getElementById('articleCategory').value = this.categories.find(c => c.name === article.category)?.id || '';
        document.getElementById('articleContent').value = article.content;
        document.getElementById('articleTags').value = article.tags ? article.tags.join(', ') : '';
        document.getElementById('articleStatus').value = article.status;
        
        document.getElementById('addArticleModal').classList.add('active');
    }
    
    // Save article (create or update)
    saveArticle() {
        const title = document.getElementById('articleTitle').value.trim();
        const categoryId = document.getElementById('articleCategory').value;
        const content = document.getElementById('articleContent').value.trim();
        const tags = document.getElementById('articleTags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
        const status = document.getElementById('articleStatus').value;
        
        if (!title || !categoryId || !content) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }
        
        const category = this.categories.find(c => c.id == categoryId);
        if (!category) {
            this.showToast('Invalid category selected', 'error');
            return;
        }
        
        if (this.editingArticleId) {
            // Update existing article
            const articleIndex = this.articles.findIndex(a => a.id == this.editingArticleId);
            if (articleIndex !== -1) {
                // Update category counts if category changed
                if (this.articles[articleIndex].category !== category.name) {
                    this.decrementCategoryCount(this.articles[articleIndex].category);
                    this.incrementCategoryCount(category.name);
                }
                
                this.articles[articleIndex] = {
                    ...this.articles[articleIndex],
                    title,
                    category: category.name,
                    content,
                    tags,
                    status,
                    lastUpdated: new Date().toISOString().split('T')[0]
                };
                
                this.showToast('Article updated successfully');
            }
        } else {
            // Create new article
            const newArticle = {
                id: this.generateId(),
                title,
                category: category.name,
                author: "Current User",
                lastUpdated: new Date().toISOString().split('T')[0],
                views: 0,
                status,
                content,
                tags
            };
            
            this.articles.unshift(newArticle);
            this.incrementCategoryCount(category.name);
            this.showToast('Article created successfully');
        }
        
        this.saveToLocalStorage();
        this.closeModals();
        this.loadArticles();
        this.loadCategories();
        this.updateStats();
        this.updatePagination();
    }
    
    // Delete article
    deleteArticle(id) {
        if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
            return;
        }
        
        const articleIndex = this.articles.findIndex(a => a.id == id);
        if (articleIndex !== -1) {
            const article = this.articles[articleIndex];
            this.decrementCategoryCount(article.category);
            this.articles.splice(articleIndex, 1);
            this.saveToLocalStorage();
            this.loadArticles();
            this.loadCategories();
            this.updateStats();
            this.updatePagination();
            this.showToast('Article deleted successfully');
        }
    }
    
    // Search articles
    searchArticles(query) {
        if (query.length < 2) {
            this.loadArticles();
            return;
        }
        
        const filteredArticles = this.articles.filter(article => 
            article.title.toLowerCase().includes(query.toLowerCase()) || 
            article.content.toLowerCase().includes(query.toLowerCase()) ||
            (article.tags && article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
        );
        
        this.displaySearchResults(filteredArticles);
    }
    
    // Display search results
    displaySearchResults(results) {
        const articlesTableBody = document.getElementById('articlesTableBody');
        articlesTableBody.innerHTML = '';
        
        if (results.length === 0) {
            articlesTableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px;">
                        <i class="fas fa-search" style="font-size: 48px; color: #dee2e6; margin-bottom: 16px;"></i>
                        <p>No articles found matching your search</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        results.forEach(article => {
            const row = document.createElement('tr');
            
            const formattedDate = new Date(article.lastUpdated).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            row.innerHTML = `
                <td>
                    <div class="article-title" data-id="${article.id}">${article.title}</div>
                </td>
                <td>${article.category}</td>
                <td>
                    <div class="author-info">
                        <span>${article.author}</span>
                    </div>
                </td>
                <td>${formattedDate}</td>
                <td>${article.views}</td>
                <td>
                    <span class="status ${article.status}">${article.status.charAt(0).toUpperCase() + article.status.slice(1)}</span>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn view" data-id="${article.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" data-id="${article.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" data-id="${article.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            articlesTableBody.appendChild(row);
        });
        
        this.attachArticleEventListeners();
    }
    
    // Show filter options (simplified for demo)
    showFilterOptions() {
        const statusFilter = prompt('Filter by status (published/draft/all):', 'all');
        if (statusFilter && ['published', 'draft', 'all'].includes(statusFilter.toLowerCase())) {
            let filteredArticles = this.articles;
            if (statusFilter !== 'all') {
                filteredArticles = this.articles.filter(article => article.status === statusFilter);
            }
            this.displaySearchResults(filteredArticles);
            this.showToast(`Filtered by: ${statusFilter}`);
        }
    }
    
    // Export articles (simplified for demo)
    exportArticles() {
        const dataStr = JSON.stringify(this.articles, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'knowledge-base-articles.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.showToast('Articles exported successfully');
    }
    
    // Pagination functions
    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadArticles();
            this.updatePagination();
        }
    }
    
    nextPage() {
        const totalArticles = this.filterCategory === 'all' ? 
            this.articles.length : 
            this.articles.filter(a => a.category === this.categories.find(c => c.id == this.filterCategory)?.name).length;
        
        const totalPages = Math.ceil(totalArticles / this.articlesPerPage);
        
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.loadArticles();
            this.updatePagination();
        }
    }
    
    updatePagination() {
        const totalArticles = this.filterCategory === 'all' ? 
            this.articles.length : 
            this.articles.filter(a => a.category === this.categories.find(c => c.id == this.filterCategory)?.name).length;
        
        const totalPages = Math.ceil(totalArticles / this.articlesPerPage);
        
        document.getElementById('paginationInfo').textContent = `Page ${this.currentPage} of ${totalPages}`;
        document.getElementById('prevPageBtn').disabled = this.currentPage === 1;
        document.getElementById('nextPageBtn').disabled = this.currentPage === totalPages || totalPages === 0;
    }
    
    // Update statistics
    updateStats() {
        const totalArticles = this.articles.length;
        const totalCategories = this.categories.length;
        const authors = [...new Set(this.articles.map(article => article.author))];
        const totalAuthors = authors.length;
        
        const monthlyViews = this.articles.reduce((sum, article) => sum + article.views, 0);
        const publishedArticles = this.articles.filter(article => article.status === 'published').length;
        const satisfactionRate = publishedArticles > 0 ? Math.round((publishedArticles / totalArticles) * 100) : 0;
        
        document.getElementById('totalArticles').textContent = totalArticles;
        document.getElementById('totalCategories').textContent = totalCategories;
        document.getElementById('totalAuthors').textContent = totalAuthors;
        
        document.getElementById('statsTotalArticles').textContent = totalArticles;
        document.getElementById('statsMonthlyViews').textContent = monthlyViews;
        document.getElementById('statsActiveAuthors').textContent = totalAuthors;
        document.getElementById('statsSatisfaction').textContent = `${satisfactionRate}%`;
    }
    
    // Close all modals
    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        this.editingArticleId = null;
    }
    
    // Show toast notification
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastIcon = toast.querySelector('.toast-icon');
        const toastMessage = toast.querySelector('.toast-message');
        
        toastMessage.textContent = message;
        
        if (type === 'error') {
            toastIcon.className = 'fas fa-exclamation-circle toast-icon';
            toastIcon.style.color = 'var(--danger)';
        } else {
            toastIcon.className = 'fas fa-check-circle toast-icon';
            toastIcon.style.color = 'var(--success)';
        }
        
        toast.classList.add('active');
        
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    }
    
    // Save data to localStorage
    saveToLocalStorage() {
        localStorage.setItem('kms_articles', JSON.stringify(this.articles));
        localStorage.setItem('kms_categories', JSON.stringify(this.categories));
    }
    
    // Generate a unique ID for new articles
    generateId() {
        return this.articles.length > 0 ? Math.max(...this.articles.map(a => a.id)) + 1 : 1;
    }
    
    // Increment category count
    incrementCategoryCount(categoryName) {
        const category = this.categories.find(c => c.name === categoryName);
        if (category) {
            category.count++;
        }
    }
    
    // Decrement category count
    decrementCategoryCount(categoryName) {
        const category = this.categories.find(c => c.name === categoryName);
        if (category && category.count > 0) {
            category.count--;
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new KnowledgeManagementSystem();
});
