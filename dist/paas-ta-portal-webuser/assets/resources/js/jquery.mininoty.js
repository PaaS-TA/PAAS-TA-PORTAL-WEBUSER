/**
 * Application:  jquery.mininoty
 * Version:      1.0.3
 * Release date: 2016-07-13
 * Author:       Stepan Maslennikov (http://github.com/StepanMas)
 * Homepage:     https://github.com/StepanMas/jQuery.miniNoty
 * License:      MIT
 */

;(function ($)
{
    var config = {
        'class'         : 'miniNoty',
        timeoutToHide   : 3000,  // timeout to hide
        timeoutAnimEnd  : 500, // timeout animate in SCSS
        view            : 'normal',
        autoHide        : true,
        message         : '',
        buttons         : [
            {
                isClose: 1,
                name   : 'Close',
                link   : '#',
                target : '',
                click  : function ()
                {
                    $(this).parent().click()
                    return false;
                }
            }
        ],
        allowButtonClose: false,
        redirect        : false,
        blank           : false
    };

    $.miniNotyConfig = {
        'set': function (newConfig)
        {
            if (newConfig)
                config = $.extend($.miniNotyConfig.get(), newConfig)
            return config;
        },
        'get': function ()
        {
            return $.extend(true, {}, config);
        }
    };

    $.miniNoty = function (message, view)
    {
        if (
            !arguments.length
            ||
            (message.constructor === String ? (!message) : (!message.message))
        )
        {
            console.warn('Message empty?');
            return this;
        }

        // settings
        var cnf = $.miniNotyConfig.get();

        var body     = $('body'),
            miniNoty = $('.' + cnf.class);


        // Create wrapper for notifications
        if (!miniNoty.length)
            miniNoty = $(
                '<div/>', {
                    'class': cnf.class
                }
            ).appendTo(body);


        // merge settings
        if (message instanceof Object)
        {
            // merge default buttons
            var buttons = cnf.buttons;

            if (message.buttons && message.allowButtonClose && (message.allowButtonClose.toString() === 'true'))
            {
                buttons         = $.merge(message.buttons, cnf.buttons);
                message.buttons = buttons
            }

            cnf = $.extend(cnf, message)
        }

        else cnf.message = message;


        var cls       = cnf.class + '_message ' + cnf.class + '_message-' + (view || cnf.view),
            elMessage = $(
                '<div/>', {
                    'class': cls,
                    html   : $(
                        '<div/>', {
                            'class': cnf.class + '_text',
                            html   : cnf.message
                        }
                    )
                }
            );

        if (cnf.buttons.length)

        // create line with icons
            $.each(
                cnf.buttons, function ()
                {

                    var appendToMessage = function ()
                    {

                        var btn = $(
                            '<a/>', {
                                'class': cnf.class + '_btn',
                                text   : this.name,
                                href   : this.link,
                                target : this.target,
                                click  : this.click
                            }
                        );

                        elMessage.append(btn)
                    };

                    if (this.isClose && message.allowButtonClose && (cnf.allowButtonClose.toString() === 'true'))
                        appendToMessage.call(this);

                    else
                        if (!this.isClose)
                            appendToMessage.call(this)

                }
            );

        miniNoty.prepend(elMessage);

        var rm = function ()
        {

            elMessage.removeClass(cnf.class + '_message-show');

            // Give CSS animation work
            setTimeout(
                function ()
                {

                    elMessage.addClass(cnf.class + '_message-remove');

                    setTimeout(
                        function ()
                        {

                            $('a', elMessage).off()
                            elMessage.off().remove()

                        }, cnf.timeoutAnimEnd
                    )

                }, cnf.timeoutAnimEnd
            )
        };

        // Delegate Event
        elMessage
            .click(
                function (e)
                {

                    if (!$(e.target).is('a'))
                        rm()

                }
            )
            .mouseenter(
                function ()
                {
                    if (autoHide) clearTimeout(autoHide)
                }
            )
            .mouseleave(
                function ()
                {
                    autoHideRun()
                }
            );

        if (cnf.redirect)
        {
            elMessage.click(
                function (e)
                {
                    if (!$(e.target).is('a'))
                    {
                        if (cnf.blank)
                            window.open(cnf.redirect)
                        else
                            window.location = cnf.redirect
                    }
                }
            )
        }


        // push stack
        setTimeout(
            function ()
            {

                elMessage.addClass(cnf.class + '_message-show')

            }, 100
        );


        // timeout to hide
        var autoHide    = null,
            autoHideRun = function ()
            {
                if (cnf.autoHide.toString() === 'true')
                    autoHide = setTimeout(rm, cnf.timeoutToHide)
            };
        autoHideRun();

        return this;
    }

})(jQuery);