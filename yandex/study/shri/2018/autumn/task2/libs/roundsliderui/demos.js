
$(document).ready(function () {
    $("h3").parent().addClass("headings").siblings().addClass("contents");
    $("h4").parent().addClass("headings").siblings().addClass("contents");

    var boxes = $(".box");
    for (var i = 0; i < boxes.length; i++) {
        var box_inner = boxes.eq(i).addClass("box-inner box-shadow").removeClass("box");
        var box_mini = createElement("div.box-" + (box_inner.attr("data-size") || "mini"));
        box_mini.insertAfter(box_inner);
        box_mini.append(box_inner);
    }
    var options = $(".demo_options");
    for (var k = 0; k < options.length; k++) {
        var option = options.eq(k);
        var target = $("#" + option.attr("data-target"));
        target.parent().append(option);
    }
    appendBlocks_sliderTypes();
    appendBlocks_circleTypes();
    appendBlocks_properties();
    appendBlocks_events();
    appendBlocks_customizations();
    appendBlocks_sliderAppearances();

    appendSeeCode($(".cell"));
    $(".custom .cell .see_code").remove();

    $("p .see_code").click(seeCode_tempClick);
    $(".cell .see_code").click(seeCode_click);

    $("h3").append(createElement("span.arrow"));
    $("h3").append(createElement("a.permalink link").append(createElement("div")));

    $("h4").append(createElement("a.permalink small link").append(createElement("div")));

    $("h3").parent().bind("click", arrowClick);
    $("h4").parent().bind("click", arrowClick);

    $("h3, h4").each(function () {
        var link = $(this).text().toLowerCase().split(" ").join("-");
        $(this).attr("id", link + "_link").children("a").attr("href", "#" + link);
    });
});

function appendSeeCode($target) {
    $target.append(createElement("span.see_code").html("Code"));
}
function createPopupEle(e) {
    $("body").children(".dynamic_code").remove();
    var closeBtn = createElement("span.button b-close").html("X");
    var popupEle = createElement("span.dynamic_code").append(closeBtn);
    return popupEle;
}
function seeCode_tempClick(e) {
    $(".cell .see_code").addClass("prev");
    setTimeout(function () { $(".cell .see_code").removeClass("prev"); }, 300);
}
function seeCode_event_click(e) {
    var popupEle = createPopupEle();
    var $target = $(this);

    var codeContainer = createElement("div.code_container");
    var titleContainer = createElement("div");
    titleContainer.append(createElement("span.selected").html("JS"));
    codeContainer.append(titleContainer);
    popupEle.append(codeContainer);

    var _id = "slider_event", jsonInput, _cell, isTheme = ($target.siblings("style").length != 0);
    _cell = $target.parent();
    jsonInput = _cell.data("props");
    jsonInput["value"] = $(this).siblings(".rs-control").data("roundSlider").options.value;

    var jsonStr = '$("#slider_event").roundSlider({' + JsonToStr(jsonInput) + '});';
    var preTag1 = createElement("pre").append(createElement("code").html(jsonStr));
    codeContainer.append(preTag1);
    formatScriptContent(preTag1.children());
    preTag1.append($target.siblings("code").clone());

    if (isTheme) {
        var _styleStr = _cell.children("style").html();

        titleContainer.append(createElement("span").html("CSS"));
        var preTag2 = createElement("pre.hidden").append(createElement("code").html(_styleStr));
        codeContainer.append(preTag2);
        formatCSSContent(preTag2.children());

        titleContainer.children("span").click(function () {
            if (!$(this).hasClass("selected")) {
                var j = titleContainer.children().index($(this));
                titleContainer.children().removeClass("selected").eq(j).addClass("selected");
                codeContainer.children("pre").addClass("hidden").eq(j).removeClass("hidden");
                popupEle.bPopup().reposition(100);
            }
        });
    }

    $("body").append(popupEle);
    createPopup(popupEle);
}
function seeCode_click(e) {
    var popupEle = createPopupEle();
    var $target = $(this);

    var cell = $target.parent().clone().empty();
    popupEle.append(cell);

    var controlEle = createElement("div");
    cell.append(controlEle);

    var codeContainer = createElement("div.code_container");
    var titleContainer = createElement("div");
    titleContainer.append(createElement("span.selected").html("JS"));
    codeContainer.append(titleContainer);
    cell.append(codeContainer);

    var _id = "slider", jsonInput, _cell, isTheme = ($target.siblings("style").length != 0);

    if (isTheme) {
        cell.addClass("tit");
        _cell = $target.parent(), _id = _cell.children("div").attr("id");
        jsonInput = _cell.data("props");
    }
    else {
        var isProperties = ($target.parents("._circle_properties").length != 0);
        if (isProperties) cell.addClass("tit");
        jsonInput = $target.parent().data("props");
    }
    jsonInput["value"] = $(this).siblings(".rs-control").data("roundSlider").options.value;

    var jsonStr = '$("#' + _id + '").roundSlider({' + JsonToStr(jsonInput) + '});';
    var preTag1 = createElement("pre").append(createElement("code").html(jsonStr));
    codeContainer.append(preTag1);
    formatScriptContent(preTag1.children());

    var extreCode = $target.siblings("code");
    if (extreCode.length > 0) preTag1.append(extreCode.clone());

    if (isTheme) {
        var _styleStr = _cell.children("style").html();
        var _style = createElement("style").html(_styleStr.split("#" + _id).join(".dynamic_code .rs-control"));
        popupEle.append(_style);

        titleContainer.append(createElement("span").html("CSS"));
        var preTag2 = createElement("pre.hidden").append(createElement("code").html(_styleStr));
        codeContainer.append(preTag2);
        formatCSSContent(preTag2.children());

        titleContainer.children("span").click(function () {
            if (!$(this).hasClass("selected")) {
                var j = titleContainer.children().index($(this));
                titleContainer.children().removeClass("selected").eq(j).addClass("selected");
                codeContainer.children("pre").addClass("hidden").eq(j).removeClass("hidden");
                popupEle.bPopup().reposition(100);
            }
        });
    }

    $("body").append(popupEle);
    createControl(controlEle, jsonInput);
    createPopup(popupEle);
}
function createPopup(popupEle) {
    popupEle.bPopup({
        onOpen: function () { $("body").addClass("hideScroll"); },
        onClose: function () { $("body").removeClass("hideScroll"); }
    });
}

function JsonToStr(obj) {
    var str = "";
    $.each(obj, function (prop, val) {
        if (typeof val == "string") val = '"' + val + '"';
        str += prop + ":" + val + ",";
    });
    if (str[str.length - 1] == ",") str = str.substring(0, str.length - 1);
    return str;
}

function arrowClick(e) {
    if ($(e.target).hasClass("permalink") || $(e.target).parent().hasClass("permalink")) return;
    e.preventDefault();
    var htag = $(this).children();
    htag.toggleClass("closed");
    htag.parent().next().slideToggle();
}
function changeTooltip(e) {
    var val = e.value, speed;
    if (val < 20) speed = "Slow";
    else if (val < 40) speed = "Normal";
    else if (val < 70) speed = "Speed";
    else speed = "Very Speed";

    return val + " km/h" + "<div>" + speed + "</div>";
}
function traceEvent(e) {
    $(".console").prepend($(document.createElement("div")).html("<b>" + e.type + "</b>" + " event triggered"));
}

function onHandleDemoChange(e) {
    $("." + e.id).siblings().not(".demo_options").css("display", "none");
    $("." + e.id).css("display", "block");
}
function clearConsole() {
    $(".console").empty();
}
function appendBlocks_sliderTypes() {
    var types = ["default", "min-range", "range"];
    var parentClass = "._slider_types";
    createBlocks(types, parentClass);

    $("._slider_types .rslider").each(function () {
        var _type = $(this).parent().attr("data-type");
        var properties = getSliderType_Prop(_type);
        createControl($(this), properties);
    });
}
function getSliderType_Prop(_type) {
    return {
        radius: 85,
        sliderType: _type,
        value: "10,40"
    };
}
function appendBlocks_circleTypes() {
    var types = ["quarter-top-left", "quarter-top-right", "quarter-bottom-left", "quarter-bottom-right",
    "half-top", "half-bottom", "half-left", "half-right", "pie", "custom-half", "custom-quarter"];
    var parentClass = "._circle_shapes";
    createBlocks(types, parentClass);

    $("._circle_shapes .rslider").each(function () {
        var _type = $(this).parent().attr("data-type");
        if (_type == types[9] || _type == types[10] || _type == types[8]) $(this).addClass("customAngle");
        var properties = getCircleType_Prop(_type);
        createControl($(this), properties);
    });

    $("#sAng").spinner({ min: 0, max: 359, spin: onValueChange }).change(function () {
        if (this.value < 0) this.value = 0;
        if (this.value > 359) this.value = 359;
        onValueChange(null, { value: this.value });
    });
}
function getCircleType_Prop(_type) {
    var props = {
        radius: 80,
        circleShape: _type,
        sliderType: "min-range",
        showTooltip: false,
        value: 50
    };
    if (_type == "pie" || _type == "custom-half" || _type == "custom-quarter") props["startAngle"] = 315;
    return props;
}
function appendBlocks_properties() {
    var allProps = {
        "min, max, step <span>and</span> value": { min: 1000, max: 10000, step: 1000, value: 3000, sliderType: "min-range" },
        "radius <span>and</span> width": { radius: 70, width: 10, max: 10, step: 0.1, value: 6, handleShape: "dot", handleSize: "+10" },
        "handleSize": { handleSize: "34,10", value: 50 },
        "editableTooltip": { editableTooltip: false, sliderType: "min-range", value: 30, handleShape: "square" },
        "startAngle <span>and</span> endAngle": { startAngle: 90, endAngle: "+225", value: 45 },
        "mouseScrollAction": { mouseScrollAction: true, value: "40" }
    };
    var parentClass = "._circle_properties";
    window.propArray = createBlocks(allProps, parentClass, true);

    $("._circle_properties .rslider").each(function (k) {
        var properties = propArray[k];
        createControl($(this), properties);
    });
}
function appendBlocks_events() {
    var props = {
        handleShape: "dot", radius: 130, width: 25, sliderType: "range", value: "20,60",
        beforeCreate: "traceEvent", create: "traceEvent", start: "traceEvent", stop: "traceEvent",
        change: "traceEvent", drag: "traceEvent"
    };
    createControl($("#slider_event"), props);
    appendSeeCode($(".controlbox"));
    $(".controlbox .see_code").click(seeCode_event_click);
}
function tooltipVal1(args) {
    var months = ["January", "February", "March", "April", "May", "June", "July",
                    "August", "September", "October", "November", "December"];

    return months[args.value];
}
function tooltipVal2(args) {
    return "$ " + args.value;
}
function appendBlocks_customizations() {
    var tooltip1 = {
        sliderType: "min-range", circleShape: "custom-quarter",
        min: 0, max: 11, value: 7, startAngle: 45, editableTooltip: false,
        radius: 300, width: 20, handleShape: "dot", tooltipFormat: "tooltipVal1"
    };
    createControl($("#tooltip1"), tooltip1);

    var tooltip2 = { radius: 90, width: 4, value: 50, handleSize: "+14", tooltipFormat: "tooltipVal2" };
    createControl($("#tooltip2"), tooltip2);

    var animation1 = { sliderType: "min-range", radius: 90, width: 16, value: 40 };
    createControl($("#animation1"), animation1);

    var handle1 = {
        sliderType: "min-range", editableTooltip: false, radius: 105, width: 16, value: 75,
        handleSize: 0, handleShape: "square", circleShape: "pie", startAngle: 315, tooltipFormat: "changeTooltip"
    };
    createControl($("#handle1"), handle1);

    var handle2 = {
        sliderType: "min-range", radius: 130, showTooltip: false, width: 16, value: 75,
        handleSize: 0, handleShape: "square", circleShape: "half-top"
    };
    createControl($("#handle2"), handle2);
}
function appendBlocks_sliderAppearances() {
    var app1 = { radius: 80, width: 14, handleSize: "24,12", handleShape: "square", sliderType: "min-range", value: "40" };
    createControl($("#appearance1"), app1);

    var app2 = { radius: 80, width: 14, handleSize: "+8", handleShape: "dot", sliderType: "min-range", value: "40" };
    createControl($("#appearance2"), app2);

    var app3 = { radius: 80, width: 9, handleSize: "+8", sliderType: "min-range", value: "40" };
    createControl($("#appearance3"), app3);

    var app4 = { radius: 90, width: 10, handleSize: "+10", sliderType: "range", value: "10,60" };
    createControl($("#appearance4"), app4);

    var app5 = { radius: 90, width: 0, handleSize: 16, handleShape: "square", value: 60 };
    createControl($("#appearance5"), app5);

    var app6 = { radius: 90, width: 14, handleSize: "+0", sliderType: "range", value: "5,55" };
    createControl($("#appearance6"), app6);

    var app7 = { radius: 80, width: 8, handleSize: "+16", handleShape: "dot", sliderType: "min-range", value: "65" };
    createControl($("#appearance7"), app7);

    var app8 = { radius: 80, width: 22, handleSize: "+0", sliderType: "min-range", value: "55" };
    createControl($("#appearance8"), app8);

    var app9 = { radius: 80, width: 20, handleSize: "+0", handleShape: "round", sliderType: "min-range", value: 60, circleShape: "pie", startAngle: 315 };
    createControl($("#appearance9"), app9);
}
function createControl($ele, props) {
    $ele.roundSlider(props);
    $ele.css({ "margin-top": -($ele.outerHeight() / 2) + "px" });
    $.data($ele.parent()[0], "props", props);
}
function createBlocks(types, parentClass, isProperties) {
    var block = $(document.createElement("div")).addClass("block");
    var cell = $(document.createElement("div")).addClass("cell");
    if (isProperties) {
        var title1 = $(document.createElement("div")).addClass("title1");
        cell.append(title1);
    }
    var rslider = $(document.createElement("div")).addClass("rslider");
    block.append(cell.append(rslider));
    var row = $(".row" + parentClass);

    var propArray = [];
    $.each(types, function (t, type) {
        var _block = block.clone();
        if (!isProperties) _block.find(".cell").attr("data-type", type);
        else {
            _block.find(".title1").html(t);
            propArray.push(type);
        }
        row.append(_block);
    });
    row.append($(parentClass + " .block.custom"));
    return propArray;
}
function updateInnerData(ele, prop, val) {
    ele.each(function () {
        var d = $(this).data("props");
        if (val == $.fn.roundSlider.prototype.defaults[prop])
            delete d[prop];
        else d[prop] = val;
    });
}
function onValueChange(event, ui) {
    $("._circle_shapes .customAngle").roundSlider({ "startAngle": ui.value });
    var cells = $("._circle_shapes .customAngle").parent();
    updateInnerData(cells, "startAngle", ui.value);
}
function onCheckChange(checkElement) {
    $("._circle_shapes .rslider").roundSlider({ "showTooltip": checkElement.checked });
    var cells = $("._circle_shapes .rslider").parent();
    updateInnerData(cells, "showTooltip", checkElement.checked);
}
function onDropDownChange(selectElement) {
    $("._circle_shapes .rslider").roundSlider({ "sliderType": selectElement.value });
    var cells = $("._circle_shapes .rslider").parent();
    updateInnerData(cells, "sliderType", selectElement.value);
}
function formatCSSContent(cssBlock) {
    var text = $(cssBlock).text()
    text = text.split("  ").join("").split("\n").join("");
    var modified = text.replace(/{/g, " {\n    ")
                .replace(/}/g, "\n}\n")
                .replace(/,#/g, ",\n#")
                .replace(/;/g, ";\n    ")
                .replace(/    \n}/g, "}");

    $(cssBlock).html(modified);
}
function formatScriptContent(scriptBlock) {
    var text = scriptBlock.text().split(" ").join("").split("\n").join("");
    text = replaceCammaInValue(text);
    var modified = text.replace(/:/g, ": ")
                .replace("({", "({\n    ")
                .replace(/,/g, ",\n    ")
                .replace("});", "\n});\n")
                .replace(/~/g, ",");
    if (scriptBlock.hasClass("event")) {
        modified = modified.replace(/function/gi, "function ")
                .replace("){", ") {").replace("){", ") {")
                .replace(/;}/g, ";\n    }")
                .replace(/%n/g, "\n    ")
                .replace(/%t/g, "    ");
    }
    scriptBlock.html(modified);
    return scriptBlock.text().split(" ").join("").split("\n").join("");
}
function replaceCammaInValue(text) {
    var t = text.match(/\d,\d/g);
    if (t instanceof Array) {
        for (var i = 0; i < t.length; i++) {
            var currentStr = t[i];
            var replaceWith = currentStr.replace(",", "~");
            text = text.replace(currentStr, replaceWith);
        }
    }
    return text;
}