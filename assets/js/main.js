(function($) {
    "use strict";
    
    //===== Prealoder (keeping your existing code)
    $(window).on('load', function(event) {
        $('.preloader').delay(500).fadeOut(500);
    });
    
    //===== Mobile Menu (keeping your existing code)
    $(".navbar-toggler").on('click', function() {
        $(this).toggleClass('active');
    });
    
    $(".navbar-nav a").on('click', function() {
        $(".navbar-toggler").removeClass('active');
    });
    
    //===== close navbar-collapse when a clicked (keeping your existing code)
    $(".navbar-nav a").on('click', function () {
        $(".navbar-collapse").removeClass("show");
    });
    
    //===== Sticky (keeping your existing code)
    $(window).on('scroll', function(event) {    
        var scroll = $(window).scrollTop();
        if (scroll < 10) {
            $(".navigation").removeClass("sticky");
        } else{
            $(".navigation").addClass("sticky");
        }
    });
    
    //===== Section Menu Active (keeping your existing code)
    var scrollLink = $('.page-scroll');
    $(window).scroll(function() {
        var scrollbarLocation = $(this).scrollTop();

        scrollLink.each(function() {
            var sectionOffset = $(this.hash).offset().top - 73;

            if ( sectionOffset <= scrollbarLocation ) {
                $(this).parent().addClass('active');
                $(this).parent().siblings().removeClass('active');
            }
        });
    });
    
    // Parallaxmouse js (keeping your existing code)
    function parallaxMouse() {
        if ($('#parallax').length) {
            var scene = document.getElementById('parallax');
            var parallax = new Parallax(scene);
        };
    };
    parallaxMouse();
    
    //===== Progress Bar Animation
    function animateProgressBars() {
        $('.progress-line').each(function() {
            var $this = $(this);
            var width = $this.data('width');
            
            $this.css('width', '0');
            
            var waypoint = new Waypoint({
                element: $this[0],
                handler: function() {
                    $this.animate({
                        width: width + '%'
                    }, 1000);
                    this.destroy();
                },
                offset: '90%'
            });
        });
    }
    
    //===== Counter Up (keeping your existing code)
    $('.counter').counterUp({
        delay: 10,
        time: 1600,
    });
    
    //===== Magnific Popup (keeping your existing code)
    $('.image-popup').magnificPopup({
        type: 'image',
        gallery:{
            enabled:true
        }
    });
    
    //===== Back to top (modified for smoother animation)
    $(window).on('scroll', function(event) {
        if($(this).scrollTop() > 600){
            $('.back-to-top').fadeIn(200)
        } else{
            $('.back-to-top').fadeOut(200)
        }
    });
    
    $('.back-to-top').on('click', function(event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: 0,
        }, 1500);
    });

    //===== Dark Mode Toggle
// Theme Toggle
const storageKey = 'theme-preference';

const getColorPreference = () => {
    if (localStorage.getItem(storageKey))
        return localStorage.getItem(storageKey);
    else
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
}

const theme = {
    value: getColorPreference(),
}

const reflectPreference = () => {
    document.firstElementChild.setAttribute('data-theme', theme.value);
    document.querySelector('#theme-toggle')?.setAttribute('aria-label', theme.value);
}

const setPreference = () => {
    localStorage.setItem(storageKey, theme.value);
    reflectPreference();
}

// Set early so no page flashes
reflectPreference();

window.onload = () => {
    // Set on load so screen readers can see latest value
    reflectPreference();

    document.querySelector('#theme-toggle')?.addEventListener('click', () => {
        theme.value = theme.value === 'light' ? 'dark' : 'light';
        setPreference();
    });
}

// Sync with system changes
window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', ({matches:isDark}) => {
        theme.value = isDark ? 'dark' : 'light';
        setPreference();
    });




    //===== Scroll Progress Bar
    const createProgressBar = () => {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    };
    createProgressBar();

    //===== Progress Bar Animation
    function initProgressBars() {
        $('.progress-line').each(function() {
            var $this = $(this);
            var width = $this.data('width');
            
            $this.appear(function() {
                $this.animate({
                    width: width + '%'
                }, 1000);
            });
        });
    }


    //===== Initialize
    $(document).ready(function() {
        initProgressBars();
        animateProgressBars();
    });

}(jQuery));



// fetch posts

// Medium Feed Integration
function loadMediumPosts() {
    // Convert Medium feed to JSON using RSS2JSON API
    const MEDIUM_USER = '@korchispace';
    const RSS2JSON_API_KEY = 'RSS2JSON_API_KEY_PLACEHOLDER'; // from rss2json.com
    const mediumRssUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/${MEDIUM_USER}&api_key=${RSS2JSON_API_KEY}`;

    fetch(mediumRssUrl)
        .then(response => response.json())
        .then(data => {
            const posts = data.items.slice(0, 3); // Get latest 3 posts
            const blogContainer = document.querySelector('#blog-posts-container');
            
            let postsHTML = '';
            posts.forEach(post => {
                // Extract first image from content or use default
                const imgElement = new DOMParser()
                    .parseFromString(post.content, 'text/html')
                    .querySelector('img');
                const imageUrl = imgElement ? imgElement.src : './assets/images/blog/b-1.jpg';
                
                // Format date
                const date = new Date(post.pubDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                postsHTML += `
                    <div class="col-lg-4 col-md-8 col-sm-9">
                        <div class="single-blog mt-30">
                            <div class="blog-image">
                                <img src="${imageUrl}" alt="${post.title}">
                            </div>
                            <div class="blog-content">
                                    <h4 class="blog-title"><a href="${post.link}">${post.title}</a></h4>
                                    <span> ${date}</span>
                                    <span><i class="lni-user"></i> ${post.author}</span>
                            </div>

                        </div>
                    </div>
                `;
            });

            blogContainer.innerHTML = postsHTML;
        })
        .catch(error => {
            console.error('Error fetching Medium posts:', error);
            document.querySelector('#blog-posts-container').innerHTML = `
                <div class="col-12 text-center">
                    <p>Failed to load blog posts. Please check out my 
                    <a href="https://medium.com/${MEDIUM_USER}" target="_blank">Medium profile</a>.</p>
                </div>
            `;
        });
}

// Call the function when document is ready
document.addEventListener('DOMContentLoaded', loadMediumPosts);



class InfiniteSlider {
    constructor() {
        // Tech logos array
        this.logos = [
            { src: 'assets/images/tech/salesforce.png', alt: 'Salesforce' },
            { src: 'assets/images/tech/odoo.png', alt: 'Odoo' },
            { src: 'assets/images/tech/spring.png', alt: 'SpringBoot' },
            { src: 'assets/images/tech/django.png', alt: 'Django' },
            { src: 'assets/images/tech/dotnet.png', alt: '.NET' },
            { src: 'assets/images/tech/llama.png', alt: 'Llama' },
            { src: 'assets/images/tech/react.png', alt: 'ReactJS' },
            { src: 'assets/images/tech/angular.png', alt: 'Angular' },
            { src: 'assets/images/tech/flutter.png', alt: 'Flutter' },
            { src: 'assets/images/tech/fastapi.png', alt: 'FastAPI' },
            { src: 'assets/images/tech/kafka.png', alt: 'Kafka' },
            { src: 'assets/images/tech/rabbitmq.png', alt: 'RabbitMQ' },
            { src: 'assets/images/tech/oracle.png', alt: 'Oracle' },
            { src: 'assets/images/tech/mongodb.png', alt: 'MongoDB' },
            { src: 'assets/images/tech/pytorch.png', alt: 'PyTorch' },
            { src: 'assets/images/tech/transformers.png', alt: 'Transformers' },
            { src: 'assets/images/tech/tensorflow.png', alt: 'TensorFlow' },
            { src: 'assets/images/tech/qiskit.png', alt: 'Qiskit' },
            { src: 'assets/images/tech/scikit.png', alt: 'Scikit-learn' },
            { src: 'assets/images/tech/docker.webp', alt: 'Docker' },
            { src: 'assets/images/tech/kubernetes.png', alt: 'Kubernetes' },
            { src: 'assets/images/tech/sonarcloud.png', alt: 'SonarCloud' }
        ];

        this.slideTrack = document.getElementById('slideTrack');
        this.position = 0;
        this.speed = 1; // Pixels per frame
        
        this.init();
    }

    init() {
        // Create initial slides
        this.createSlides();
        
        // Start animation
        this.animate();
    }

    createSlides() {
        // Create three sets of slides for seamless looping
        const slides = [...this.logos, ...this.logos, ...this.logos].map(logo => `
            <div class="slide">
                <img src="${logo.src}" alt="${logo.alt}">
            </div>
        `).join('');
        
        this.slideTrack.innerHTML = slides;
        
        // Set initial width
        this.slideTrack.style.width = `${this.logos.length * 250 * 3}px`; // 250px per slide * 3 sets
    }

    animate = () => {
        // Move slides
        this.position -= this.speed;
        
        // Reset position when one set is complete
        if (Math.abs(this.position) >= this.logos.length * 250) {
            this.position = 0;
        }
        
        this.slideTrack.style.transform = `translateX(${this.position}px)`;
        
        // Continue animation
        requestAnimationFrame(this.animate);
    }
}

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InfiniteSlider();
});