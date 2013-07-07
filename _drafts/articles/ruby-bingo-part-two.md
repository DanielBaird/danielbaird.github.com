Ruby Walkthrough: Making Bingo Cards, Part 2
============================================

I'm walking through a Ruby project -- making cards for a game of "Baby Bingo" at my wife's baby shower.  In [part 1](), I describe the project and get a bit of code down that makes a bingo card.  Here's part 2.

Wrapping it up in a class
-------------------------

As soon as you need more than one of something, it's generally worth making a class for it.  I want more than one bingo card, so now I'll make a bingo card class.

Here's what a Ruby class looks like:

    class BingoCard
        # ..methods here..
    end

If you make an `initialize` method in your class, Ruby will use that to set up instances of your class.  So that's the perfect place for the random-number-picking Ruby code from part 1.

    class BingoCard

        initialize
            @card = []
            5.times do
                row = []
                5.times do
                    row << rand(25)
                end
                @card << row
            end
        end

    end

I've made one change to the number-picking code: I'm using `@card` instead of just `card`.  Using an `@` in front of a variable like `@card` means the variable will stay around inside a class instance, instead of disappearing at the end of the current method.

That'll make more sense after this next bit.

The other code we wrote in part 1 was the printing part.  Here it is pasted into our BingoCard class:

    class BingoCard
        # ------------------------------------
        def initialize
            @card = []
            5.times do
                row = []
                5.times do
                    row << rand(25)
                end
                @card << row
            end
        end
        # ------------------------------------
        def print_card
            @card.each do |row|
                row.each do |square|
                    print square.to_s.center 5
                end
                puts
            end
        end
        # ------------------------------------
    end

I've made one change here as well: instead of giving the method a card to print (`a_card`), I'm just using to `@card`.  That's why we used `@card` in the `initialise` method -- so we can refer to it here.  Keeping track of "inner" variables like `@card` is one of the reasons objects are useful.

Also, I've added some commented lines of dashes between the class methods.  That's not required by Ruby or anything, it's just a weird quirk I picked up ages ago.  Feel free to just leave a blank line or two.

Classes are templates for making actual things
----------------------------------------------

Okay so now I've written a class, we can make objects that "have" that class.  Like this:

    class BingoCard
        # ...
    end

    my_card = BingoCard.new    # make a new BingoCard
    my_card.print_card         # print it

Now we've re-created the results of part 1, but all neatly wrapped up in a class.  Now it's easy to make and print out several cards:

    my_card = BingoCard.new
    your_card = BingoCard.new
    another_card = BingoCard.new
    
    puts "Mine:"
    my_card.print_card
    
    puts "Yours:"
    your_card.print_card
    
    puts "Theirs:"
    another_card.print_card

Notice that each card has its own version of the `@cards` data structure.  Yay objects.  Also notice that it's slightly awkward to say `my_card.print_card`.  So I'll rename the `print_card` method to just `show` (I can't easily use `print` because of the existing `print` method).

    class BingoCard
        # ------------------------------------
        def initialize
            @card = []
            5.times do
                row = []
                5.times do
                    row << rand(25)
                end
                @card << row
            end
        end
        # ------------------------------------
        def show
            @card.each do |row|
                row.each do |square|
                    print square.to_s.center 5
                end
                puts
            end
        end
        # ------------------------------------
    end

    my_card = BingoCard.new
    your_card = BingoCard.new
    another_card = BingoCard.new

    puts "Mine:"
    my_card.show

    puts "Yours:"
    your_card.show

    puts "Theirs:"
    another_card.show

### Use words not numbers

Alright, where are we?  Reviewing my feature list from part 1, I can see a few problems with our output:
* Sometimes the same number shows up twice (or thrice, or, um.. quice?);
* There might be draws, where multiple boards win with the same five things;
* The boards have numbers instead of cute baby-related photos.

Bingo cards that look pretty, with all baby pictures on, is a good job for HTML.  We can just put image URLs into a HTML table -- so we should probably use image URLs instead of numbers.  Next I'll change the code to put strings (that could be filenames or URLs or whatever) into the squares instead of numbers, and deal with the HTML layout later.

Here's an array of strings in Ruby:

    items = ['baby','rattle','teddy']
    puts items

I'll modify the `initialize` method to take an array, and use those to populate the card's squares.

        def initialize items
            @card = []
            5.times do
                row = []
                5.times do
                    row << items[rand items.length]
                end
                @card << row
            end
        end

I'm passing in a `items` array, and when I'm adding a square to a row, I'm picking a random item from the array.

Even though you call `BingoCard.new` when you make a `BingoCard` object, the arguments you give to `new` make their way to your `initialize` method.

Use it like this:

    my_card = BingoCard.new ['a','b','c']
    puts "Mine:"
    my_card.show

Yep that's working.  But we need at least 25 things, which is, like, sooooo muuuch typing.  So here's something fancier:

    my_card = BingoCard.new [*'a'..'z']
    puts "Mine:"
    my_card.show

See the `[*'a'..'z']`?  There's two interesting things here.  Firstly, Ruby understands _ranges_.  `1..10` is a range that starts at `1` and goes to `10`.  'a'..'z' is a range that goes from `a` to `z`.

Secondly, if you put an asterisk `*` in front of something, Ruby will try to make that thing an array.  When it's used this way the asterisk is called the 'splat' operator, and it's pretty weird.

If you haven't seen splat before, this might be a bit confusing.  For now, just trust me: if you splat a range, you get an array of all the values in that range.

Alright, so we're passing in a list of strings and using those for the values of our bingo card squares.  But they're still being repeated.  Let's fix that now.

Here's where a random item is picked out of the item list:

                    row << items[rand items.length]

That line picks a random number up to the length of the array, and gets the thing at that position.  If we also removed the thing from the list, it wouldn't be in the list for next time.

Ruby usually makes things easy for you, and in this case, the `Array` class has exactly the method we want -- `delete_at`, which deletes an item from the array while also returns the deleted item.  So we can drop in a `delete_at` like this:

                    row << items.delete_at(rand items.length)

Run that a few times to see if you get any repeated items.  No?  Awesome.  Remember the three features I listed in the "Framing the problem" section of part 1?  One was **No repeats**, and we've just achieved it.  We've also just added a small bug -- if that concerns you, maybe you should hurry along to part 3.

Extra credit
------------

Nervous that a single letter isn't enough?  Try making your own item list, like this:

    my_card = BingoCard.new [*'abc'..'def']

Or like this:

    item_list = [
        'dummy',
        'blanket',
        'easter bunny',
        # ..think up more, until you have 25!
    ]
    my_card = BingoCard.new item_list
    puts "Mine:"
    my_card.show

You might need to change your show method, which currently assumes squares will be up to 5 letters across.  See if you can fix it:

        def show
            @card.each do |row|
                row.each do |square|
                    print square.to_s.center 5
                end
                puts
            end
        end












