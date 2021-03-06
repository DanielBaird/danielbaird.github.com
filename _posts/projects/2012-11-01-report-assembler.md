---
layout: project
category: projects
title: Report Assembler
tags: ['Javascript|the JavaScript / ECMAScript programming language']
timeperiod: late 2012
projecturl: https://github.com/DanielBaird/Report-Assembler
sourceurl: https://github.com/DanielBaird/Report-Assembler
---
This is little JavaScript library that takes JSON data and a carefully written source document, and merges them into a result document.  It's aimed at making prose descriptions of scientific data.  I started this so I could get CliMAS Reports finished as quickly as possible.

Report Assembler replaces `$$variable` in your document with a value, and will work out `[[ logical == conditions ]]` to determine which parts of the document should be included.  For example, with this JSON:

{% highlight javascript %}
{
    "ZombieSpeedMpS": 4.5
    "IncubationDays": 2
}
{% endhighlight %}

You can write a report template like this:

{% highlight text %}
Your local zombie variety moves at $$ZombieSpeedMpS
metres per second.  If you get bitten, you will turn into a zombie
after $$IncubationDays [[IncubationDays != 1]]days.
[[IncubationDays == 1]]day.
{% endhighlight %}

..and Report Assembler can give you a nice report on zombies:

> Your local zombie variety moves at 4.5 mph.  If you get bitten, you will turn into a zombie after 2 days.

The library isn't particularly powerful, but it served its purpose of letting the scientist working with me on [CliMAS Reports]({% post_url projects/2012-12-18-climas %}) write a kind of super-document with many complicated conditional parts, without them having to be a programmer themselves.

Find out more from the [source code]({{ page.sourceurl }}), in particular [the readme](https://github.com/DanielBaird/Report-Assembler/blob/master/README.md) includes a little documentation.
