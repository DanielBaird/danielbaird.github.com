
// AMD compatibility copied from https://github.com/umdjs/umd/blob/master/amdWeb.js
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory); // Register as an anonymous AMD module
    } else {
        root.workit = factory(); // install as a browser global
    }
}(this, function() {

    var oldWorkit = window.workit;

    // private funcs & vars =========================================

    // sassafrassin IE needs this shim:
    if (!Array.prototype.forEach) { Array.prototype.forEach = function (fn, scope) {
        'use strict'; var i, len; for (i = 0, len = this.length; i < len; ++i) { if (i in this) { fn.call(scope, this[i], i, this); } }
    };}

    // convenience functions
    var p2 = function(x) { return Math.pow(x,2); } // power of two
    var p3 = function(x) { return Math.pow(x,3); } // power of three
    var p4 = function(x) { return Math.pow(x,4); } // power of four
    var sq = p2; // squared => power of two
    var cu = p3; // cubed => power of three
    var pow = function(x,y) { return Math.pow(x,y); } // x to the power of y
    var elemId = function(id) { return document.getElementById(id); }
    var round = function(x,places) { var tens = Math.pow(10,places); return (round(x * tens)/tens); }
    defaultOpts = {
        debug:  (document.URL.indexOf('debug') >= 0),  // true or false
        form:   'workitform',     // string id, or reference to HTML element
        output: 'workitresult',   // string id, or reference to HTML element
    }
    var attach = function(element, eventType, handler) {
        if (element.addEventListener) { element.addEventListener(eventType, handler, false) }
        else if (element.attachEvent) { element.attachEvent('on' + eventType, handler) };
    }

    return {
        // public funcs =============================================

        init: function(data, userOpts) {
            // store user data
            this.data = data;

            // merge together user options and default options
            this.options = {};
            for (var attr in defaultOpts) { this.options[attr] = defaultOpts[attr]; }
            for (var attr in userOpts)    { this.options[attr] = userOpts[attr]; }

            // work out the DOM elements
            this.form = this.options.form;
            if (typeof this.form === 'string') {
                this.form = document.getElementById(this.form);
            }
            this.output = this.options.output;
            if (typeof this.output === 'string') {
                this.output = document.getElementById(this.output);
            }
        },
        // ----------------------------------------------------------
        buildForm: function() {
            data.vars.forEach( function(theVar) {
                var html = document.createElement('div');
                var that = this;
                html.innerHTML += '<label for="var-' + theVar.abbr + '">' + theVar.name + '</label>';
                html.innerHTML += '<input type="number" ' +
                        'id="var-' + theVar.abbr + '" ' +
                        'name="var-' + theVar.abbr + '" ' +
                        'value="' + theVar.defaultVal + '"/>'
                html.innerHTML += theVar.units;
                html.innerHTML += '<span class="var-note" id="var-note-' + theVar.abbr + '"></span>';
                this.form.appendChild(html);
                attach(elemId('var-' + theVar.abbr), 'change', function(){ that.calculate(); });
                attach(elemId('var-' + theVar.abbr), 'keyup',  function(){ that.calculate(); });
            }, this);
            this.calculate();
        },
        // ----------------------------------------------------------
        getInputs: function() {
            // collect inputs and check them for validity
            varValues = {};
            valuesOkay = true;
            data.vars.forEach( function(theVar) {
                var elem = elemId('var-' + theVar.abbr);
                // clear the warning spot
                elemId('var-note-' + theVar.abbr).innerHTML = '';
                if (elem) {
                    var value = elem.value;
                    if (value) {
                        value = parseFloat(value);
                        if (!isNaN(value)) {
                            // okay it's a parseable value.
                            // now check its range.
                            if (value < theVar.failMin || value > theVar.failMax) {
                                // outside of the non-fail range.. fail out.
                                elemId('var-note-' + theVar.abbr).innerHTML = theVar.failMsg;
                                valuesOkay = false;
                            } else {
                                // inside the non-fail range.
                                if (value < theVar.warnMin || value > theVar.warnMax) {
                                    // outside the tested range..
                                    elemId('var-note-' + theVar.abbr).innerHTML = theVar.warnMsg;
                                }
                                varValues[theVar.abbr] = value;
                            }
                        }
                    } else { valuesOkay = false }
                } else { valuesOkay = false }
            });

            if (valuesOkay) return varValues;
            return null;
        },
        // ----------------------------------------------------------
        calculate: function() {

            this.output.innerHTML = '';

            var varValues = this.getInputs();

            if (!varValues) {
                this.output.innerHTML += '<p>Input values not valid.</p>';
            } else {

                data.calcs.forEach( function(calc) {

                    if (calc.terms.length != calc.coefficients.length) {
                        output.innerHTML += '<p>' + calc.name + ' has mismatched terms and coefficients.</p>';
                    } else {
                        // we'll loop downward through the terms
                        var term = calc.terms.length;
                        // ..and sum them into this var.
                        var sum = 0;

                        // track info about each term
                        var termsInfo = [];

                        // loop through the terms, working each one out and adding them up
                        while (term--) {
                            var termInfo = {};

                            // loop through vars replace each one in the expression
                            var expression = calc.terms[term];
                            termInfo.exprInitial = expression;

                            data.vars.forEach( function(theVar) {
                                expression = expression.replace(theVar.abbr, '('+ varValues[theVar.abbr] +')');
                            });

                            termInfo.exprReplaced = expression;
                            termInfo.exprResult = eval(expression);
                            termInfo.coefficient = calc.coefficients[term];

                            // now evaluate the expression and multiply by the coefficient
                            var thisTerm = calc.coefficients[term] * eval(expression);
                            termInfo.result = thisTerm;
                            sum += thisTerm;
                            termsInfo.unshift(termInfo);
                        }

                        // remember this value in varValues
                        varValues[calc.abbr] = parseFloat(sum.toFixed(calc.rounding));
                        varValues[calc.abbr + '_capped'] = sum;
                        varValues[calc.abbr + '_precise'] = sum;

                        // apply the rounding and capping
                        var sumStr = sum.toFixed(calc.rounding);
                        if (calc.lowcap && sum < calc.lowcap) {
                            sumStr = '< ' + calc.lowcap;
                            varValues[calc.abbr + '_capped'] = calc.lowcap;
                        } else if (calc.highcap && sum > calc.highcap) {
                            sumStr = '> ' + calc.highcap;
                            varValues[calc.abbr + '_capped'] = calc.highcap;
                        }
                        if (!calc.hidden) {
                            var calcResult = '<div id="calc-' + calc.abbr + '" class="calcwrapper"><div class="calcresult"><span class="name">' + calc.name + '</span> ';
                            calcResult += '<span class="value" title="raw value: ' + sum.toFixed((calc.rounding + 1) * 2) + ' ' + calc.units + '">' + sumStr + '</span>'
                            calcResult += '<span class="units">' + calc.units + '</span></div>';

                            // debug: show terms and coefficients.
                            if (this.options.debug) {
                                var info = '';
                                info += '<button class="show info" onclick="document.getElementById(\'calc-' + calc.abbr + '\').className = \'calcwrapper wide\';">&gt;</button>';
                                info += '<button class="hide info" onclick="document.getElementById(\'calc-' + calc.abbr + '\').className = \'calcwrapper\';">&lt;</button>';
                                info += '<div class="calcinfo"><table>';
                                info += '<tr><td colspan="2">Actual: ' + sum + '</td></tr>';
                                info += '<tr><th>Term</th><th>Coefficient</th></tr>';
                                for (var t = 0; t < calc.terms.length; t++) {
                                    info += '<tr><td>' + calc.terms[t] + '</td><td>' + calc.coefficients[t].toExponential(3) + '</td></tr>';
                                }
                                info += '</table></div>';
                                calcResult += info;
                            }
                            calcResult += '</div>';
                            this.output.innerHTML += calcResult;
                        }
                    }

                }, this); // end of working out all the calcs.

                // work out the conclusions
                data.conclusions.forEach( function(conc) {
                    var condition = conc.condition;
                    var content = conc.content;
                    for (var varName in varValues) {
                        var varValue = varValues[varName];
                        condition = condition.split(varName).join('(' + varValue + ')');
                        content = content.split('$$' + varName).join(varValue);
                    };
                    // console.log(conc.condition, condition);
                    // console.log(conc.content, content);

                    if (eval(condition)) {
                        this.output.innerHTML += '<p>' + content + '</p>';
                    } else if (this.options.debug) {
                        this.output.innerHTML += '<p style="opacity: 0.33"><span style="background: #ccc; padding: 0.2em 0.5em; position: relative; top: -0.1em; font-size: 66%; font-weight: bold">not showing:</span> ' + content + '</p>';
                    }
                }, this);
            }
        },
        // ----------------------------------------------------------
        noConflict: function() {
            window.workit = oldWorkit;
        }
        // ----------------------------------------------------------
    };
}));
