$(function () {



    // ------------------------------------------------------- //
    // Navbar Sticky
    // ------------------------------------------------------ //
    $(window).on('scroll', function () {
        if ($(window).scrollTop() > ($('.top-bar').outerHeight())) {
            $('header.nav-holder.make-sticky').addClass('sticky');
            $('header.nav-holder.make-sticky').css('margin-bottom', '' + $('.top-bar').outerHeight() * 1.5 + 'px');
            $('#content').css('margin-top', '' + $('.top-bar').outerHeight() * 1.5 + 'px');

        } else {
            $('header.nav-holder.make-sticky').removeClass('sticky');
            $('header.nav-holder.make-sticky').css('margin-bottom', '0');
            $('#content').css('margin-top', '0');
        }
    });

    // ------------------------------------------------------- //
    // Scroll To
    // ------------------------------------------------------ //
    $('.scroll-to').on('click', function (e) {

        e.preventDefault();
        var full_url = this.href;
        var parts = full_url.split("#");
        var target = parts[1];

        if ($('header.nav-holder').hasClass('sticky')) {
            var offset = -80;
        } else {
            var offset = -180;
        }

        var offset = $('header.nav-holder').outerHeight();

        $('body').scrollTo($('#' + target), 800, {
            offset: -offset
        });

    });


    // ------------------------------------------------------- //
    // Tooltip Initialization
    // ------------------------------------------------------ //
    $('[data-toggle="tooltip"]').tooltip();


    // ------------------------------------------------------- //
    // Product Gallery Slider
    // ------------------------------------------------------ //
    function productDetailGallery() {
        $('a.thumb').on('click', function (e) {
            e.preventDefault();
            source = $(this).attr('href');
            $('#mainImage').find('img').attr('src', source);
        });

        for (i = 0; i < 3; i++) {
            setTimeout(function () {
                $('a.thumb').eq(i).trigger('click');
            }, 300);
        }
    }

    productDetailGallery();


    // ------------------------------------------------------- //
    // Customers Slider
    // ------------------------------------------------------ //
    $(".customers").owlCarousel({
        responsiveClass: true,
        responsive: {
            0: {
                items: 2
            },
            600: {
                items: 3
            },
            1000: {
                items: 6
            }
        }
    });


    // ------------------------------------------------------- //
    // Testimonials Slider
    // ------------------------------------------------------ //
    $(".testimonials").owlCarousel({
        items: 4,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 2
            },
            1000: {
                items: 4
            }
        }
    });


    // ------------------------------------------------------- //
    // Homepage Slider
    // ------------------------------------------------------ //
    $('.homepage').owlCarousel({
        loop: true,
        margin: 0,
        dots: true,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        addClassActive: true,
        navText: [
            "<i class='fa fa-angle-left'></i>",
            "<i class='fa fa-angle-right'></i>"
        ],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1,
                loop: true
            }
        }
    });


    // ------------------------------------------------------- //
    // Adding fade effect to dropdowns
    // ------------------------------------------------------ //
    $('.dropdown').on('show.bs.dropdown', function () {
        $(this).find('.dropdown-menu').first().stop(true, true).fadeIn(100);
    });
    $('.dropdown').on('hide.bs.dropdown', function () {
        $(this).find('.dropdown-menu').first().stop(true, true).fadeOut(100);
    });


    // ------------------------------------------------------- //
    // Project Caroudel
    // ------------------------------------------------------ //
    $('.project').owlCarousel({
        loop: true,
        margin: 0,
        dots: true,
        nav: true,
        autoplay: true,
        smartSpeed: 1000,
        addClassActive: true,
        lazyload: true,
        navText: [
            "<i class='fa fa-angle-left'></i>",
            "<i class='fa fa-angle-right'></i>"
        ],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1,
                loop: true
            }
        }
    });


    // ------------------------------------------------------- //
    // jQuery Counter Up
    // ------------------------------------------------------ //
    $('.counter').counterUp({
        delay: 10,
        time: 1000
    });


    // ------------------------------------------------------- //
    // click on the box activates the radio
    // ------------------------------------------------------ //
    $('#checkout').on('click', '.box.shipping-method, .box.payment-method', function (e) {
        var radio = $(this).find(':radio');
        radio.prop('checked', true);
    });


    // ------------------------------------------------------- //
    //  Bootstrap Select
    // ------------------------------------------------------ //
    $('.bs-select').selectpicker({
        style: 'btn-light',
        size: 4
    });


    // ------------------------------------------------------- //
    //  Shop Detail Carousel
    // ------------------------------------------------------ //
    window.check = true;
    var intervalId = setInterval(() => {
        if ($('.shop-detail-carousel').length > 0) {
            $('.shop-detail-carousel').owlCarousel({
                items: 1,
                thumbs: true,
                nav: false,
                loop: true,
                dots: false,
                autoplay: true,
                thumbsPrerendered: true
            });
            // console.log('interval');

        }
        if($('#tg-nzlEO').length && window.check){
            TgTableSort("tg-nzlEO")
            window.check = false
        }
    }, 1000);


    // ------------------------------------------------------ //
    // For demo purposes, can be deleted
    // ------------------------------------------------------ //

    var stylesheet = $('link#theme-stylesheet');
    $("<link id='new-stylesheet' rel='stylesheet'>").insertAfter(stylesheet);
    var alternateColour = $('link#new-stylesheet');

    if ($.cookie("theme_csspath")) {
        alternateColour.attr("href", $.cookie("theme_csspath"));
    }

    $("#colour").change(function () {

        if ($(this).val() !== '') {

            var theme_csspath = 'css/style.' + $(this).val() + '.css';

            alternateColour.attr("href", theme_csspath);

            $.cookie("theme_csspath", theme_csspath, {
                expires: 365,
                path: document.URL.substr(0, document.URL.lastIndexOf('/'))
            });

        }

        return false;
    });

    if ($.cookie("theme_layout")) {
        $('body').addClass($.cookie("theme_layout"));
    }

    $("#layout").change(function () {

        if ($(this).val() !== '') {

            var theme_layout = $(this).val();

            $('body').removeClass('wide');
            $('body').removeClass('boxed');

            $('body').addClass(theme_layout);

            $.cookie("theme_layout", theme_layout, {
                expires: 365,
                path: document.URL.substr(0, document.URL.lastIndexOf('/'))
            });
        }
    });

    var TgTableSort = window.TgTableSort || function (n, t) {
        "use strict";

        function r(n, t) {
            for (var e = [], o = n.childNodes, i = 0; i < o.length; ++i) {
                var u = o[i];
                if ("." == t.substring(0, 1)) {
                    var a = t.substring(1);
                    f(u, a) && e.push(u)
                } else u.nodeName.toLowerCase() == t && e.push(u);
                var c = r(u, t);
                e = e.concat(c)
            }
            return e
        }

        function e(n, t) {
            var e = [],
                o = r(n, "tr");
            return o.forEach(function (n) {
                var o = r(n, "td");
                t >= 0 && t < o.length && e.push(o[t])
            }), e
        }

        function o(n) {
            return n.textContent || n.innerText || ""
        }

        function i(n) {
            return n.innerHTML || ""
        }

        function u(n, t) {
            var r = e(n, t);
            return r.map(o)
        }

        function a(n, t) {
            var r = e(n, t);
            return r.map(i)
        }

        function c(n) {
            var t = n.className || "";
            return t.match(/\S+/g) || []
        }

        function f(n, t) {
            return -1 != c(n).indexOf(t)
        }

        function s(n, t) {
            f(n, t) || (n.className += " " + t)
        }

        function d(n, t) {
            if (f(n, t)) {
                var r = c(n),
                    e = r.indexOf(t);
                r.splice(e, 1), n.className = r.join(" ")
            }
        }

        function v(n) {
            d(n, L), d(n, E)
        }

        function l(n, t, e) {
            r(n, "." + E).map(v), r(n, "." + L).map(v), e == T ? s(t, E) : s(t, L)
        }

        function g(n) {
            return function (t, r) {
                var e = n * t.str.localeCompare(r.str);
                return 0 == e && (e = t.index - r.index), e
            }
        }

        function h(n) {
            return function (t, r) {
                var e = +t.str,
                    o = +r.str;
                return e == o ? t.index - r.index : n * (e - o)
            }
        }

        function m(n, t, r) {
            var e = u(n, t),
                o = e.map(function (n, t) {
                    return {
                        str: n,
                        index: t
                    }
                }),
                i = e && -1 == e.map(isNaN).indexOf(!0),
                a = i ? h(r) : g(r);
            return o.sort(a), o.map(function (n) {
                return n.index
            })
        }

        function p(n, t, r, o) {
            for (var i = f(o, E) ? N : T, u = m(n, r, i), c = 0; t > c; ++c) {
                var s = e(n, c),
                    d = a(n, c);
                s.forEach(function (n, t) {
                    n.innerHTML = d[u[t]]
                })
            }
            l(n, o, i)
        }

        function x(n, t) {
            var r = t.length;
            t.forEach(function (t, e) {
                t.addEventListener("click", function () {
                    p(n, r, e, t)
                }), s(t, "tg-sort-header")
            })
        }
        var T = 1,
            N = -1,
            E = "tg-sort-asc",
            L = "tg-sort-desc";
        return function (t) {
            var e = n.getElementById(t),
                o = r(e, "tr"),
                i = o.length > 0 ? r(o[0], "td") : [];
            0 == i.length && (i = r(o[0], "th"));
            for (var u = 1; u < o.length; ++u) {
                var a = r(o[u], "td");
                if (a.length != i.length) return
            }
            x(e, i)
        }
    }(document);
    // $(function (n) {
    //     setTimeout(() => {
    //         console.log('====================================');
    //         console.log('going to run');
    //         console.log('====================================');
    //         TgTableSort("tg-nzlEO")
    //     }, 5000);
    // });
});