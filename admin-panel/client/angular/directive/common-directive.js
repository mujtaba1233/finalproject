vulusionApp.filter('limitChar', function () {
    return function (content, length, tail) {
        if (isNaN(length))
            length = 50;

        if (tail === undefined)
            tail = "...";

        if (content && content.length <= length) {
            return content;
        } else {
            return String(content).substring(0, length - tail.length) + tail;
        }
    };
});
vulusionApp.directive('clickToCopy', function (CommonService) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            function functionToBeCalled() {
                if (attrs.clickToCopy) {
                    var $temp_input = $("<input>");
                    $("body").append($temp_input);
                    $temp_input.val(attrs.clickToCopy).select();
                    document.execCommand("copy");
                    $temp_input.remove();
                    CommonService.showSuccess('Text Copied');
                }
            }
            elem.on('click', functionToBeCalled);
        }
    };
});
vulusionApp.filter('tel', function () {
    return function (tel) {
        if (!tel) {
            return '';
        }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 10: // +1PPP####### -> C (PPP) ###-####
                country = 1;
                city = value.slice(0, 3);
                number = value.slice(3);
                break;

            case 11: // +CPPP####### -> CCC (PP) ###-####
                country = value[0];
                city = value.slice(1, 4);
                number = value.slice(4);
                break;

            case 12: // +CCCPP####### -> CCC (PP) ###-####
                country = value.slice(0, 3);
                city = value.slice(3, 5);
                number = value.slice(5);
                break;

            default:
                return tel;
        }

        if (country == 1) {
            country = "";
        }

        number = number.slice(0, 3) + '-' + number.slice(3);

        return (country + " (" + city + ") " + number).trim();
    };
});

vulusionApp.directive('stFilteredCollection', function () {
    return {
        require: '^stTable',
        link: function (scope, element, attr, ctrl) {
            scope.$watch(ctrl.getFilteredCollection, function (val) {
                scope.filteredCollection = val.length;
                scope.filteredCollectionData = val;
            })
        }
    }
});
vulusionApp.directive('contenteditable', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            // view -> model
            element.bind('blur keyup change', function () {
                scope.$apply(function () {
                    ctrl.$setViewValue(element.html());
                });
            });
            // model -> view
            ctrl.$render = function () {
                element.html(ctrl.$viewValue);
            };
            // load init value from DOM
            ctrl.$render();
        }
    };
});
vulusionApp.directive('numeric', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            element.on('mousewheel', function () {
                var el = $(this);
                el.blur();
                // setTimeout(function () {
                //     el.focus();
                // }, 10);
            });
        }
    };
});
vulusionApp.directive('scrollSync', function () {
    return {
        link: function (scope, element, attrs, ctrl) {
            // console.log('scrollSync');

            setTimeout(function () {
                $('.div1').width($('.table-responsive')[0].scrollWidth)
                $("tbody tr").click(function () {
                    $("tr").removeClass("selected-row");
                    $(this).addClass("selected-row")
                })
                element.on('scroll', function (e) {
                    $('.table-responsive').scrollLeft(element.scrollLeft());
                });
                $('.table-responsive').on('scroll', function (e) {
                    element.scrollLeft($('.table-responsive').scrollLeft());
                });
            })
        }
    };
});

vulusionApp.directive('decimalPlaces', function () {
    return {
        link: function (scope, ele, attrs) {
            ele.bind('keypress', function (e) {
                var newVal = $(this).val() + (e.charCode !== 0 ? String.fromCharCode(e.charCode) : '');
                if ($(this).val().search(/^[0-9]{0,11}(?:\.[0-9]{0,2})?$/) === -1) {
                    e.preventDefault();
                }
            });
        }
    };
});