
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
    var elemId = function(id) { return document.getElementById(id); }
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
            this.table = this.parseTable(data.table);

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
        parseTable: function(tableStrs) {
            var table = [];
            tableStrs.forEach( function(rowStr) {
                var row = {};
                var values = rowStr.split(/\s*,\s*/);
                values.forEach( function(value, valueIndex) {
                    row[data.columnOrder[valueIndex]] = (value === '-' ? undefined : parseInt(value));
                });
                table.push(row);
            });
            if (console.table) {
                console.table(table);
            }
            return table;
        },
        // ----------------------------------------------------------
        buildForm: function() {
            data.inputColumns.forEach( function(column) {
                var html = document.createElement('div');
                html.setAttribute('class', 'form-element');
                var that = this;
                html.innerHTML += '<label for="var-' + column.abbr + '">' + column.name + '</label>';
                html.innerHTML += '<input type="number" ' +
                        'id="var-' + column.abbr + '" ' +
                        'name="var-' + column.abbr + '" ' +
                        'value="' + column.defaultVal + '"/>'
                html.innerHTML += column.units;
                html.innerHTML += '<span class="var-note" id="var-note-' + column.abbr + '"></span>';
                this.form.appendChild(html);
                attach(elemId('var-' + column.abbr), 'change', function(){ that.calculate(); });
                attach(elemId('var-' + column.abbr), 'keyup',  function(){ that.calculate(); });
            }, this);
            this.calculate();
        },
        // ----------------------------------------------------------
        getInputs: function() {
            // collect inputs and check them for validity
            varValues = {};
            valuesOkay = true;
            data.inputColumns.forEach( function(column) {
                var elem = elemId('var-' + column.abbr);
                // clear the warning spot
                elemId('var-note-' + column.abbr).innerHTML = '';
                if (elem) {
                    var value = elem.value;
                    if (value) {
                        value = parseFloat(value);
                        if (!isNaN(value)) {
                            // okay it's a parseable value.
                            // now check its range.
                            if (value < column.failMin || value > column.failMax) {
                                // outside of the non-fail range.. fail out.
                                elemId('var-note-' + column.abbr).innerHTML = column.failMsg;
                                valuesOkay = false;
                            } else {
                                // inside the non-fail range.
                                if (value < column.warnMin || value > column.warnMax) {
                                    // outside the tested range..
                                    elemId('var-note-' + column.abbr).innerHTML = column.warnMsg;
                                }
                                varValues[column.abbr] = value;
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

                var bestRows = []; // indexes of best rows
                for (var r = 0; r < this.table.length; r++) {
                    bestRows.push(r);
                }

                // work through the input columns finding best matches
                data.inputColumns.forEach( function(column) {

                    console.log(column, bestRows);

                    var truth = varValues[column.abbr];
                    var delta = function(a, b) { return Math.abs(a - b); }
                    var bestDelta = delta(this.table[bestRows[0]][column.abbr], truth);
                    bestRows.forEach( function(rowIndex) {
                        var candidateDelta = delta(truth, this.table[rowIndex][column.abbr]);
                        if ( candidateDelta < bestDelta ) {
                            bestDelta = candidateDelta;
                        }
                    }, this);

                    // now pull out just the rows that are 'best' and make a new bestRows
                    var evenBetterRows = [];
                    bestRows.forEach( function(rowIndex) {
                        if ( delta(truth, this.table[rowIndex][column.abbr]) == bestDelta ) {
                            evenBetterRows.push(rowIndex);
                        }
                    }, this);

                    bestRows = evenBetterRows;

                }, this);

                // cool now we've got indexes for the best matches.
                console.log(bestRows);

                bestRows.forEach( function(rowIndex) {

                    // show results

                    var resultSet = '<div class="resultset">';
                    if (bestRows.length > 1) {
                        resultSet += '<h1><small>Result set ' + (rowIndex + 1) + ' of ' + bestRows.length + '</small></h1>';
                    }
                    this.data.outputColumns.forEach( function(col) {
                        var calcResult = '<div id="calc-' + col.abbr + '" class="calcwrapper"><div class="calcresult"><span class="name">' + col.name + '</span> ';
                        if (this.table[rowIndex][col.abbr] === undefined) {
                            calcResult += '<span class="value">-</span>'
                        } else {
                            calcResult += '<span class="value">' + this.table[rowIndex][col.abbr] + '</span>'
                        }
                        calcResult += '<span class="units">' + col.units + '</span></div>';

                        calcResult += '</div>';
                        if (! col.hidden) {
                            resultSet += calcResult;
                        }
                    }, this);
                    resultSet += '</div>';
                    this.output.innerHTML += resultSet;

                    // work out the conclusions

                    data.conclusions.forEach( function(conc) {
                        var condition = conc.condition;
                        var content = conc.content;
                        this.data.columnOrder.forEach( function(varName) {
                            var varValue = this.table[rowIndex][varName];
                            condition = condition.split(varName).join('(' + varValue + ')');
                            content = content.split('$$' + varName).join(varValue);
                        }, this);

                        if (eval(condition)) {
                            this.output.innerHTML += '<p>' + content + '</p>';
                        } else if (this.options.debug) {
                            this.output.innerHTML += '<p style="opacity: 0.33"><span style="background: #ccc; padding: 0.2em 0.5em; position: relative; top: -0.1em; font-size: 66%; font-weight: bold">not showing:</span> ' + content + '</p>';
                        }
                    }, this);


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
