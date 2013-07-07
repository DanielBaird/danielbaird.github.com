---
layout: post
category: coding
title: 'Ruby Walkthrough: Making Bingo Cards, Part 1'
---
Ruby Walkthrough: Making Bingo Cards, Part 1
============================================

My wife is having a baby, and my 11 year old daughter wanted to plan the baby shower. One of the games she plans is "Baby Bingo" -- bingo, where the squares are baby-related pictures.  She asked me to help prepare the bingo cards, a task which seems algorithmic and slightly maths-y.  Quick! To a text editor!

What's Bingo?
-------------

I thought everyone knew what bingo was, but I had to explain bingo to a couple of people this week, so here's a brief description of the game. Skip this bit if you're already familiar with the game.

Bingo is a game of chance. Players each get a bingo card, which is a square grid of randomly selected numbers.  Like this:

Xxxxxxxxx

A bingo caller chooses numbers at random, calling each number out.  The players mark off a number from their card if it gets called.

Play continues and players mark off more and more numbers from their cards.  Eventually some player will have marked off all the numbers in a line across their bingo card. The line can be a row, column, or a corner-to-corner diagonal.  That player shouts out "bingo!" and wins a prize.

Framing the problem
-------------------
So let's use Ruby to make some bingo cards.  Here are the features I want in my bingo card maker:

**No repeats.**  I'm not sure how real bingo does it, but I don't want the same thing showing up in multiple squares on a single bingo card.

**No draws.**  It would be nice to avoid draws, where two players get bingo at the same time. I think real bingo has draws which are broken by who's first to yell out "bingo", but that's for serious bingo players and we want a more casual party atmosphere.

**Images, not numbers.**  The bingo squares should be pictures of things like babies, bottles, rattles etc. rather than numbers.

Let's get started.  Initially I'll ignore the things I just mentioned, but I'll fix them up eventually.

First step: a bingo card data structure
---------------------------------------

Data structures are important, and I often like to start a little project like this by working out a data structure and testing it.  

We need a square grid.  Ruby has arrays, and arrays-of-arrays. So we can make a bingo grid as an array of rows, where each row is an array of numbers.

    card = []                # start with a blank array
    5.times do               # loop 5 times..
        card &lt;&lt; [1,2,3,4,5]  # add an array to the 'cards' array
    end                      # ..end of the 5-times loop

    puts card                # print the card

Save that into a file and run it.  Hmm, a long single column of numbers.  That looks right, but it's quite hard to understand the card.

Nicer output
------------
Let's make card output a bit better.

    def print_card a_card         # make a mathod called 'print_card'
        a_card.each do |row|      # loop through each row..
            row.each do |square|  # loop through each square in the row..
                print square      # print the current square
            end                   # ..end of each-square loop
            puts                  # put a newline after each row of squares
        end                       # ..end of each-row loop
    end                           # end of the print_card method

    card = []
    5.times do
        card &lt;&lt; [1,2,3,4,5]
    end

    print_card card

That looks nicer, and confirms our card structure is okay.  It would look even cooler with random numbers though, right?

    def print_card a_card
        # ...
    end

    card = []
    5.times do               # loop 5 times (to make 5 rows)
        row = []             # each row starts as an empty array
        5.times do           # loop 5 times..
            row &lt;&lt; rand(25)  # add a random number to the row
        end                  # ..end of 5-times loop
        card &lt;&lt; row          # add our filled-in row to the card
    end                      # end of the 5-rows loop

    print_card card

<aside class="note language ruby">
    Ruby only requires brackets around method arguments when it would be ambiguous to leave them out.  In this code, `row &lt;&lt; (rand(25))`, `row &lt;&lt; (rand 25)` and `row &lt;&lt; rand(25)` all work, but `row &lt;&lt; rand 25` doesn't.
</aside>

So now that we have some two-digit numbers, our output looks jumbled up.

Even nicer output
-----------------

It's easy to add a space after each number:

    def print_card a_card
        a_card.each do |row|
            row.each do |square|
                print square + " "
            end
            puts
        end
    end

..except that doesn't work -- you'll see a `String can't be coerced into Fixnum` error.  That's because Ruby sees you're trying to add a string to a number, which doesn't make sense.  Ruby will let you do  all sorts of useful maths-y things with strings, like `puts ("Na" * 2 + " ") * 8 + "Batman!"`, but here Ruby wants you to be clear about what you mean by "adding" a string and a number.

In this case you want to join them together as strings.  So use the `to_s` method to turn the number into a string:

                print square.to_s + " "

..and that works, kind of.  It's all irregular though.  What we really want is for each number to take up a certain width, irrespective of how many digits it takes.  Ruby strings have a `center` method that does the trick:

                print square.to_s.center 5

<aside class="note language ruby">
Ruby lets you chain methods together, where you call a method directly on the result of an earlier method.  So instead of writing code like this:

    my_number = 360
    my_number_as_string = my_number.to_s
    puts my_number_as_string.center(5)

You can write this:

    my_number = 360
    puts my_number.to_s.center(5)

Or even this:

    puts 360.to_s.center(5)

Chaining methods can look a bit confusing, but used in the right places, it can rid your code of unnecessary temporary variables.
</aside>

Bam! Awesome.  We're miles away from meeting the features I want, but I'm confident the data structure is working, so it's time to go make dinner.  In Part 2 I'll use a Ruby class to wrap up all this functionality.














