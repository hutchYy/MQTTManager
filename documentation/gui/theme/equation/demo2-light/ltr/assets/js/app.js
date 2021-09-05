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
        mainHeader: '.header.navbar',
        headerhamburger: '.toggle-sidebar',
        fixed: '.fixed-top',
        mainContainer: '.main-container',
        sidebar: '#sidebar',
        sidebarContent: '#sidebar-content',
        sidebarStickyContent: '.sticky-sidebar-content',
        ariaExpandedTrue: '#sidebar [aria-expanded="true"]',
        ariaExpandedFalse: '#sidebar [aria-expanded="false"]',
        contentWrapper: '#content',
        contentWrapperContent: '.container',
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
        mobile: function() {
            $('.menu-categories li > .collapse').on('shown.bs.collapse', function(e){

                e.preventDefault();
                e.stopPropagation();

                var childPos = $(this).parent().offset();
                var parentPos = $('#topbar').offset();
                var childOffset = {
                    top: childPos.top - parentPos.top,
                    left: childPos.left - parentPos.left
                }

                $("#topbar").mCustomScrollbar('scrollTo', '-='+childOffset.top);
            });
        }
    } 
    // Default Enabled

    var toggleFunction = {
        sidebar: function() {
            $('.sidebarCollapse').on('click', function (sidebar) {
                sidebar.preventDefault();
                $(Selector.mainContainer).toggleClass("sidebar-closed");
                $(Selector.mainContainer).toggleClass("sbar-open");
                $('.overlay').toggleClass('show');
                $('html,body').toggleClass('sidebar-noneoverflow');
                $('footer .footer-section-1').toggleClass('f-close');
            });
        },
        CS: function() {
            $(".toggle-control-sidebar").click(function(B) {
                B.preventDefault();
                $(".control-sidebar").toggleClass("control-sidebar-open");
                $('.cs-overlay').toggleClass('show');
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
                $('html,body').removeClass('sidebar-noneoverflow');
            });
        },
        CSoverlay: function() {
            $('.cs-overlay').on('click', function () {
                $(this).removeClass('show'); 
                $('html,body').removeClass('cs-noneoverflow');
                $('.control-sidebar').removeClass('control-sidebar-open'); 
            })
        },
        deactivateScroll: function() {
            $('#topbar').mCustomScrollbar("destroy");
        },
    }

    var mobileFunctions = {
        activateScroll: function() {
            $("#topbar").mCustomScrollbar({
                theme: "minimal",
                scrollInertia: 1000
            });
        },
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
    var desktopFunctions = {
        activateScroll: function() {
            $(".menu-categories li.menu .submenu").mCustomScrollbar({
                theme: "minimal",
                scrollInertia: 1000
            });
        },
        hideMenu: function() {
            $(document).on('click',function(e){
                if (!$( ".menu-categories li.menu > .submenu" ).is(e.target) && !$( ".menu-categories li.menu > .submenu" ).has(e.target).length) {
                    $('.menu-categories li.menu > .submenu').collapse('hide');
                }
            })
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
                $('.menu-categories li > .collapse').removeClass('eq-animated eq-fadeInUp')
                categoryScroll.mobile();
                mobileFunctions.search();
                mobileFunctions.activateScroll();
            }
        },
        onResize: function() {
            $(window).on('resize', function(event) {
                event.preventDefault();
                var windowWidth = window.innerWidth;
                if ( windowWidth <= MediaSize.md ) {
                    $('.menu-categories li > .collapse').removeClass('eq-animated eq-fadeInUp')
                    mobileFunctions.search();
                    mobileFunctions.activateScroll();
                    console.log('On Mobile Resize');
                }
            });
        }
    }

    var _desktopResolution = {
        onRefresh: function() {
            var windowWidth = window.innerWidth;
            if ( windowWidth > MediaSize.md ) {
                toggleFunction.deactivateScroll();
                $('.menu-categories li > .collapse').addClass('eq-animated eq-fadeInUp')
                desktopFunctions.hideMenu();
                desktopFunctions.activateScroll();
                console.log('On Desktop Refresh');
            }
        },
        onResize: function() {
            $(window).on('resize', function(event) {
                event.preventDefault();
                var windowWidth = window.innerWidth;
                if ( windowWidth > MediaSize.md ) {
                    $('.menu-categories li > .collapse').addClass('eq-animated eq-fadeInUp')
                    $('footer .footer-section-1').removeClass('f-close');
                    desktopFunctions.activateScroll();
                    toggleFunction.deactivateScroll();
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
            toggleFunction.CS();
            // Overlay fn
            toggleFunction.overlay();
            // CSoverlay
            toggleFunction.CSoverlay();
            // Desktop Resoltion fn
            _desktopResolution.onRefresh();
            _desktopResolution.onResize();
            // Mobile Resoltion fn
            _mobileResolution.onRefresh();
            _mobileResolution.onResize();

        },
    }

}();
