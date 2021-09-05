var App = function() {
    var MediaSize = {
        xl: 1200,
        lg: 992,
        md: 991,
        sm: 576
    };
    var ToggleClasses = {
        headerhamburger: '.toggle-sidebar',
        inputFocused: 'input-focused',
    };
    var Selector = {
        mainContainer: '.main-container',
        ariaExpandedTrue: '#sidebar [aria-expanded="true"]',
        ariaExpandedFalse: '#sidebar [aria-expanded="false"]',
        mainContentArea: '.main-content',
        mainFooter: '.theme-footer',
        searchFull: '.search-full',
        overlay: {
            sidebar: '.overlay',
            cs: '.cs-overlay',
            search: '.search-overlay'
        },
    };
    var categoryScroll = {
        default: function() {
            $('.menu-categories li.menu .submenu .sub-sub-submenu-list .collapse').not(':first').on('shown.bs.collapse', function(e){
                e.preventDefault();
                e.stopPropagation();

                var childPos = $(this).parent().offset();
                var parentPos = $('.menu-categories li.menu .submenu').offset();
                var childOffset = {
                    top: childPos.top - parentPos.top,
                    left: childPos.left - parentPos.left
                }
                $(".menu-categories li.menu .submenu").mCustomScrollbar('scrollTo', '-='+childOffset.top);
            });
        },
    }
    // Default Enabled
    var toggleFunction = {
        sidebar: function() {
            $('.sidebarCollapse').on('click', function (sidebar) {
                sidebar.preventDefault();

                if ($('.submenu-scroll').parent().hasClass('show')) {
                    // console.log('main1');
                    if ($('.submenu-scroll').parent().hasClass('show') && !$(Selector.mainContainer).hasClass('hide-sub')) {
                        $(Selector.mainContainer).toggleClass('hide-sub');
                        // console.log('con - 1');
                    } else if ($(Selector.mainContainer).hasClass('hide-sub') && $(Selector.mainContainer).hasClass('sbar-open') && !$(Selector.mainContainer).hasClass('sub-show')) {           
                        $(Selector.mainContainer).toggleClass("sbar-open");
                        $(Selector.mainContainer).addClass("sub-show");
                        $('.overlay').toggleClass('show');
                        $('html,body').toggleClass('sidebar-noneoverflow');
                        // console.log('con - 2');
                        $(Selector.mainContainer).toggleClass("sidebar-closed");

                        $('footer .footer-section-1').toggleClass('f-close');
                    } else if ($(Selector.mainContainer).hasClass('sidebar-closed')) {
                        $(Selector.mainContainer).toggleClass("sbar-open");
                        $('.overlay').toggleClass('show');
                        $('html,body').toggleClass('sidebar-noneoverflow');
                        $(Selector.mainContainer).toggleClass("sidebar-closed");
                        $('footer .footer-section-1').toggleClass('f-close');
                        // console.log('con - 3');
                    } else {
                        $(Selector.mainContainer).toggleClass('hide-sub');
                        $(Selector.mainContainer).removeClass("sub-show");
                        // console.log('con - 4');
                    }
                } else  {
                    // console.log('main2');
                    $(Selector.mainContainer).toggleClass("sidebar-closed");
                    $(Selector.mainContainer).toggleClass("sbar-open");
                    $('.overlay').toggleClass('show');
                    $('html,body').toggleClass('sidebar-noneoverflow');
                    $('footer .footer-section-1').toggleClass('f-close');
                }

            });
        },
        profileSidebar: function() {
            $(".user-profile-dropdown").click(function(B) {
                B.preventDefault();
                $(".profile-sidebar").toggleClass("profile-sidebar-open");
                $('.ps-overlay').toggleClass('show');
                $('html,body').toggleClass('cs-noneoverflow');
            });
        },
        overlay: function() {
            $('#dismiss, .overlay, cs-overlay').on('click', function () {
                // hide sidebar
                $(Selector.mainContainer).addClass('sidebar-closed');
                $(Selector.mainContainer).removeClass('sbar-open');
                // hide overlay
                $('.overlay').removeClass('show');
                $(Selector.mainContainer).addClass('hide-sub');
                $(Selector.mainContainer).addClass("sub-show");
                $('html,body').removeClass('sidebar-noneoverflow');
            });
        },
        PSoverlay: function() {
            $('.ps-overlay').on('click', function () {
                $(this).removeClass('show'); 
                $('.profile-sidebar').removeClass('profile-sidebar-open'); 
            })
        },
        //  $fn to remove .hide-sub class from main-content if the class is already applied 
        removeClassOnMainCategoryClick: function() {
            $('.menu-categories li.menu > .submenu.collapse').on('show.bs.collapse', function(e){
                if ($(Selector.mainContainer).hasClass('hide-sub')) {
                    $(Selector.mainContainer).removeClass('hide-sub');
                }
            })
        }
    }
    var inBuiltfunctionality = {
        activateScroll: function() {
            $(".menu-categories li.menu .submenu .submenu-scroll").mCustomScrollbar({
                theme: "minimal",
                scrollInertia: 1000,
            });
        },
        mainCatActivateScroll: function() {
            $("#modernSidebar").mCustomScrollbar({
                theme: "minimal",
                scrollInertia: 1000,
            });
        },
        profileSidebarScroll: function() {
            $('.profile-content-scroll').mCustomScrollbar({
                theme: "minimal",
                scrollInertia: 1000,
            });
        },
        autoScrollHeight: function( selectorElement, calHeight ) {
            $(selectorElement).height(calHeight);
        }
    }
    var mobileFunctions = {
        search: function() {
            $(Selector.searchFull).click(function(event) {
               $(this).addClass(ToggleClasses.inputFocused);
               $(Selector.overlay.search).addClass('show');
            });

            $(Selector.overlay.search).click(function(event) {
               $(this).removeClass('show');
               $(Selector.searchFull).removeClass(ToggleClasses.inputFocused);
            });
        }
    }
    var controlSidebar = {
        chk: function() {
            $(".chb").change(function() {
               $(".chb").prop('checked',false);
               $(this).prop('checked',true);
            });
        }
    }
    var _mobileResolution = {
        onRefresh: function() {
            var windowWidth = window.innerWidth;
            if ( windowWidth <= MediaSize.md ) {
                console.log('On Mobile Refresh');
                mobileFunctions.search();
                heightc =  $(window).height()-$('.desktop-nav').outerHeight();
                inBuiltfunctionality.autoScrollHeight(".menu-categories li.menu .submenu .submenu-scroll", heightc);
                inBuiltfunctionality.autoScrollHeight("#modernSidebar", heightc);
                inBuiltfunctionality.autoScrollHeight(".profile-content-scroll", heightc);
                $('.footer-section .footer-section-1').width(0);
            }
        },
        onResize: function() {
            $(window).on('resize', function(event) {
                event.preventDefault();
                var windowWidth = window.innerWidth;
                if ( windowWidth <= MediaSize.md ) {
                    mobileFunctions.search();
                    heightc =  $(window).height()-$('.desktop-nav').outerHeight();
                    inBuiltfunctionality.autoScrollHeight(".menu-categories li.menu .submenu .submenu-scroll", heightc);
                    inBuiltfunctionality.autoScrollHeight("#modernSidebar", heightc);
                    inBuiltfunctionality.autoScrollHeight(".profile-content-scroll", heightc);
                    $('.footer-section .footer-section-1').width(0);
                    console.log('On Mobile Resize');
                }
            });
        }
    }
    var _desktopResolution = {
        onRefresh: function() {
            var windowWidth = window.innerWidth;
            if ( windowWidth > MediaSize.md ) {
                console.log('On Desktop Refresh');
                heightc =  $(window).height()-$('.desktop-nav').outerHeight();
                inBuiltfunctionality.autoScrollHeight(".menu-categories li.menu .submenu .submenu-scroll", heightc);
                inBuiltfunctionality.autoScrollHeight(".profile-content-scroll", heightc);
                inBuiltfunctionality.autoScrollHeight("#modernSidebar", heightc);
                $('.footer-section .footer-section-1').width($('.modernSidebar-nav').outerWidth());
            }
        },
        onResize: function() {
            $(window).on('resize', function(event) {
                event.preventDefault();
                var windowWidth = window.innerWidth;
                heightc =  $(window).height()-$('.desktop-nav').outerHeight();
                if ( windowWidth > MediaSize.md ) {
                    $('footer .footer-section-1').removeClass('f-close');
                    inBuiltfunctionality.autoScrollHeight(".menu-categories li.menu .submenu .submenu-scroll", heightc);
                    inBuiltfunctionality.autoScrollHeight("#modernSidebar", heightc);
                    inBuiltfunctionality.autoScrollHeight(".profile-content-scroll", heightc);
                    $('.footer-section .footer-section-1').width($('.modernSidebar-nav').outerWidth());
                    console.log('On Desktop Resize');
                }
            });
        }
    }

    return {
        init: function() {
            
            controlSidebar.chk();
            // Sidebar fn
            toggleFunction.sidebar();
            // Control Sidebar fn
            toggleFunction.profileSidebar();
            // Overlay fn
            toggleFunction.overlay();
            // PSoverlay
            toggleFunction.PSoverlay();
            toggleFunction.removeClassOnMainCategoryClick();
            // Desktop Resoltion fn
            _desktopResolution.onRefresh();
            _desktopResolution.onResize();
            // Mobile Resoltion fn
            _mobileResolution.onRefresh();
            _mobileResolution.onResize();

            inBuiltfunctionality.activateScroll()
            inBuiltfunctionality.mainCatActivateScroll();
            inBuiltfunctionality.profileSidebarScroll();

        },
    }

}();
