/**
 *  fan - A movie compilation and playback app for Windows. Fast. Lean. No weather widget.
 *  Copyright (C) 2013-2014 Nikola Klaric.
 *
 *  This program is free software; you can redistribute it and/or
 *  modify it under the terms of the GNU General Public License
 *  as published by the Free Software Foundation; either version 2
 *  of the License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.

 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, write to the Free Software
 *  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 *  @author Nikola Klaric (nikola@klaric.org)
 *  @copyright Copyright (C) 2013-2014 Nikola Klaric
 */

; var ka = ka || {}; if (!('lib' in ka)) ka.lib = {};


ka.lib.browser = {

    isHidden: function () {
        return $('#boom-detail-panel').data('boom.isHidden');
    }

  , isExpanded: function () {
        return $('#boom-detail-panel').data('boom.isExpanded');
    }

  , setExpanded: function () {
        $('#boom-detail-panel').data('boom.isExpanded', true);
    }

  , setContracted: function () {
        $('#boom-detail-panel').data('boom.isExpanded', false);
    }

  , setupExpansion: function () {
        if (!ka.lib.browser.isExpanded() && !ka.lib.browser.isHidden()) {
            var selectedPoster = $('#boom-detail-browser :nth-child(' + (ka.state.currentDetailBrowserPosterColumn + 2) + ')'),
                movieObj = ka.lib.grid.getMovieListSnapshot()[selectedPoster.data('boom.index')];
            ka.lib.browser.poster.setSource(movieObj.keyPoster);
            ka.lib.browser.expandUp();
        }
    }

  , expandUp: function () {
        ka.state.view = 'limbo';

        ka.lib.browser.setExpanded();

        $('#boom-detail-title').velocity({translateZ: 0, width: 1580, height: '-=100'}, ka.settings.durationNormal);
        $('#boom-detail-collection').velocity({translateZ: 0, bottom: '+=100', opacity: 0}, {duration: ka.settings.durationNormal, display: 'none'});

        $('#boom-detail-storyline').velocity({translateZ: 0, top: '-=120'}, ka.settings.durationNormal);

        $('#boom-detail-browser, #boom-detail-focus').velocity({translateZ: 0, bottom: '+=247px', opacity: 0}, {display: 'none', duration: ka.settings.durationNormal});

        $('#boom-detail-panel').velocity({translateZ: 0, bottom: 0}, {duration: ka.settings.durationNormal, complete: function () {
            ka.state.view = 'detail';
        }});
    }

  , contractDown: function () {
        if (ka.lib.browser.isExpanded() && !ka.lib.browser.isHidden()) {
            ka.state.view = 'limbo';

            ka.lib.browser.poster.slideDown();

            $('#boom-detail-title').velocity({translateZ: 0, width: 1049, height: '+=100'}, ka.settings.durationNormal);
            $('#boom-detail-collection').css('display', 'inline-block').velocity({translateZ: 0, bottom: '-=100', opacity: 1}, ka.settings.durationNormal);

            $('#boom-detail-storyline').velocity({translateZ: 0, top: '+=120'}, ka.settings.durationNormal);

            $('#boom-detail-browser').css('display', 'inline-block').velocity({translateZ: 0, bottom: '-=247px', opacity: 1}, ka.settings.durationNormal);
            $('#boom-detail-focus').css('display', 'inline-block').velocity({translateZ: 0, bottom: [226, 473], opacity: 1}, ka.settings.durationNormal);

            $('#boom-detail-panel').velocity({translateZ: 0, bottom: -223}, {duration: ka.settings.durationNormal, complete: function () {
                ka.lib.browser.setContracted();
                ka.state.view = 'detail';
            }});
        }
    }

  , show: function () {
        $('#boom-movie-detail').css('display', 'block');
    }

  , toggle: function () {
        var isHidden = $('#boom-detail-panel').data('boom.isHidden'),
            direction = isHidden ? '+' : '-',
            distance = ka.lib.browser.isExpanded() ? 470 : 247;

        $('#boom-detail-panel').data('boom.isHidden', !isHidden);

        ka.state.view = 'limbo';
        var toggleElements = '#boom-detail-panel';
        if (!ka.lib.browser.isExpanded()) {
            /* toggleElements += ', #boom-detail-focus'; */
        }
        $(toggleElements).velocity({translateZ: 0, bottom: direction + '=' + distance}, {duration: ka.settings.durationNormal, complete: function () {
            ka.state.view = 'detail';
        }});
    }

  , focus: {

        reposition: function () {
            $('#boom-detail-focus').velocity({left: 1110 + 2 + 160 * ka.state.currentDetailBrowserPosterColumn}, 0);
        }

    }

  , poster: {

        isHidden: function () {
            return $('#boom-detail-large-poster').data('boom.isHidden');
        }

      , setSource: function (key) {
            $('#boom-detail-large-poster img')
                .data('boom.isLoaded', false)
                .attr('src', '/movie/poster/' + key + '-' + (ka.state.isPosterScaled[key] ? 300 : 200) + '.image');
        }

      , onLoaded: function () {
            $(this).data('boom.isLoaded', true);

            if (ka.lib.browser.isExpanded()) {
                if (ka.lib.browser.poster.isHidden()) {
                    $('#boom-detail-large-poster').css('display', 'block')
                        .data('boom.isHidden', false).velocity({bottom: [10, -480]}, ka.settings.durationNormal);
                } else {
                    $('#boom-detail-large-poster').css('display', 'block');
                }
            }
        }

      , hide: function () {
            $('#boom-detail-large-poster')
                .find('img').attr('src', '').data('boom.isLoaded', false).end()
                .data('boom.isHidden', true).velocity({bottom: [-480, 10]}, {duration: 0, display: 'none'});
            // TODO: remove and cache
        }

      , slideDown: function () {
            $('#boom-detail-large-poster').data('boom.isHidden', true).velocity({bottom: [-480, 10]}, {duration: ka.settings.durationNormal, display: 'none', complete: function () {
                $(this).find('img').attr('src', '').data('boom.isLoaded', false);
            }});
        }

    }

  , backdrop: {

        init: function () {
            return $('.boom-movie-detail-poster-loader').css('opacity', 0);
        }

      , clear: function () {
            $('#boom-movie-detail').css('backgroundImage', '');
        }

      , setImmediate: function (movieObj) {
            $('#boom-movie-detail').css('backgroundImage', 'url(/movie/backdrop/' + movieObj.keyBackdrop + '.jpg)');
        }

      , loadOptimistic: function (movieObj) {
            $('#boom-movie-detail-poster-foreground')
                .css('opacity', 0)
                .data({
                    'boom.isCached': movieObj.isBackdropCached
                  , 'boom.id': movieObj.id
                })
                .attr('src', '/movie/backdrop/' + movieObj.keyBackdrop +  '.jpg');
        }

      , loadPessimistic: function (movieObj) {
            if (movieObj.isBackdropCached) {
                ka.lib.browser.backdrop.loadOptimistic(movieObj);
            } else {
                if (!$('#boom-movie-detail-poster-background').data('boom.isDefocused')) {
                    ka.state.uncachedBackdropDelayTimer = setTimeout(function () {
                        $('#boom-movie-detail-poster-foreground').css('opacity', 0);
                        $('#boom-movie-detail-poster-background').css('opacity', 1).data('boom.isDefocused', true);
                        ka.lib.browser.backdrop.clear();
                        ka.lib._focusOutImage($('#boom-movie-detail-poster-background'));
                    }, ka.settings.durationShort);
                }

                ka.lib.browser.backdrop.loadOptimistic(movieObj);
            }
        }

      , onLoaded: function () {
            clearTimeout(ka.state.uncachedBackdropDelayTimer);
            $('#boom-movie-detail-poster-background').velocity('stop');

            $('#boom-movie-detail-poster-foreground').velocity({translateZ: 0, opacity: 1}, {duration: ka.settings.durationNormal, complete: function () {
                $('#boom-movie-detail').css('backgroundImage', 'url(' + $(this).attr('src') + ')');

                $('#boom-movie-detail-poster-background')
                    .attr('src', $('#boom-movie-detail-poster-foreground').attr('src'))
                    .data('boom.isDefocused', false)
                    .get(0).style.webkitFilter = 'none';

                if (!$(this).data('boom.isCached')) {
                    var id = $(this).data('boom.id');
                    ka.data.byId[id].isBackdropCached = true;
                    $.get('/movie/' + id + '/set-backdrop-cached');
                }
            }});
        }

    }

  , posters: {

        show: function (callback) {
            $('#boom-detail-focus').velocity({bottom: -21}, {duration: 0, complete: function () {
                $('#boom-detail-focus').css('display', 'block').velocity({bottom: 226}, ka.settings.durationNormal);
                $('#boom-detail-browser').css('display', 'inline-block').velocity({bottom: '+=247'}, {
                    duration: ka.settings.durationNormal
                  , complete: callback
                });
            }});
        }

      , fadeUp: function () {
            $('#boom-detail-browser').velocity({bottom: '+=' + 247, opacity: 0}, 0);
            $('#boom-detail-focus').velocity({bottom: 473, opacity: 0}, 0);

            ka.state.currentDetailBrowserPosterColumn = ka.lib.populateDetailBrowserGrid();

            ka.lib.browser.focus.reposition();
        }

    }

};


ka.lib.startTrailerPlayer = function (id) {
    ka.state.movieTrailerPlayer.loadVideoById({
        videoId: id
      , suggestedQuality: 'hd1080'
    });
    ka.state.movieTrailerPlayer.playVideo();
    ka.state.movieTrailerPlayer.setPlaybackQuality('hd1080');
};


ka.lib.closeTrailerPlayer = function () {
    ka.state.movieTrailerPlayer.stopVideo();
    ka.state.movieTrailerPlayer.clearVideo();

    ka.state.view = 'select-stream';

    $('#boom-movie-trailer').css('display', 'none');

    /* $('#boom-movie-grid-container').css('display', 'block'); */

    $('#boom-movie-detail').velocity('fadeIn', ka.settings.durationNormal);

    window.focus();
};


ka.lib._addBrowserGridImage = function (keyPoster, index, unselected) {
    var styles = {
        webkitTransform: 'translate3d(0, 0, 0)'
      , webkitFilter: (unselected) ? 'saturate(0%) opacity(0.5)' : ''
      , width: 150
      , marginLeft: 10
    };

    if (keyPoster in ka.cache.smallBrowserPosterByKey) {
        return ka.cache.smallBrowserPosterByKey[keyPoster].data('boom.index', index).css(styles).appendTo('#boom-detail-browser');
    } else {
        return $('<img>', {
            src: '/movie/poster/' + keyPoster + '-' + (ka.state.isPosterScaled[keyPoster] ? 150 : 200) + '.image'
          , width: 150
          , height: 225
          , data: {'boom.index': index}
          , css: styles
        }).appendTo('#boom-detail-browser');
    }
};

ka.lib._addBrowserGridDummy = function () {
    return $('<img>', {
        width: 0
      , height: 225
      , css: {
            webkitFilter: 'saturate(0%) opacity(0.5)'
          , webkitTransform: 'translate3d(0, 0, 0)'
          , marginLeft: 0
        }
    }).prependTo('#boom-detail-browser');
};


ka.lib.populateDetailBrowserGrid = function () {
    $('#boom-detail-browser').empty();
    $('<img>', {
          width: 150
        , height: 225
        , css: {
            webkitFilter: 'saturate(0%) opacity(0.5)'
          , webkitTransform: 'translate3d(0, 0, 0)'
        }
    }).appendTo('#boom-detail-browser');

    var current = ka.lib.grid.getMovieIndexSnapshot()[$('#boom-movie-detail').data('boom.id')],
        index, end, focused,
        movieList = ka.lib.grid.getMovieListSnapshot();

    if (movieList.length < 6) {
        index = 0;
        end = movieList.length;
        focused = current;
    } else {
        index = current - 2;
        if (index < 0) {
            focused = 2 + index;
            index = 0;
        } else {
            focused = 2;
        }
        end = index + 5;
        if (end > movieList.length) {
            if (focused == 2 && movieList.length > 5) {
                focused = 2 + end - movieList.length;
                index -= end - movieList.length;
            }
            end = movieList.length;
        }
    }

    do {
        ka.lib._addBrowserGridImage(movieList[index].keyPoster, index, index != current);
    } while (++index < end);

    /* Pre-cache previous/next posters. */
    /* var lookBehindIndex = index - 3, lookAheadIndex = index + 3;
    if (lookBehindIndex > -1) {
        var lookBehindKey = movieList[lookBehindIndex].keyPoster;
        new Image().src = '/movie/poster/' + lookBehindKey + '-' + (ka.state.isPosterScaled[lookBehindKey] ? 150 : 200) + '.image';
    }
    if (lookAheadIndex < movieList.length) {
        var lookaAheadKey = movieList[lookAheadIndex].keyPoster;
        new Image().src = '/movie/poster/' + lookBehindKey + '-' + (ka.state.isPosterScaled[lookaAheadKey] ? 150 : 200) + '.image';
    } */

    return focused;
};


ka.lib.updateDetailBrowserInfo = function (movieObj, fade) {
    if (fade) {
        setTimeout(function () {
            ka.lib._updateDetailBrowserInfo(movieObj);
        }, ka.settings.durationShort);
    } else {
        ka.lib._updateDetailBrowserInfo(movieObj);
    }
};


ka.lib._updateDetailBrowserInfo = function (movieObj) {
    $('#boom-movie-detail').data('boom.id', movieObj.id);

    var title = (ka.state.gridSortDisplayLanguage == 'localized') ? movieObj.titleLocalized : movieObj.titleOriginal,
        rating = ((movieObj.rating) ? (movieObj.rating / 10) : '?') + '/10',
        collectionName = (movieObj.isCompiled) ? (movieObj.compilation + ' Collection') : '';

    $('#boom-detail-title').text(title);
    $('#boom-detail-collection').html(collectionName || '&nbsp;');

    if (rating.length == 4 && movieObj.rating) {
        rating = rating.replace('/', '.0/');
    }
    $('#boom-detail-release').text(movieObj.releaseYear);
    $('#boom-detail-rating').text(rating);
    $('#boom-detail-runtime').text(movieObj.runtime + ' min');
    $('#boom-detail-genres').text(movieObj.genres || '');
    $('#boom-detail-storyline').text(movieObj.storyline);
};


ka.lib.moveDetailBrowserLeft = function () {
    var column = ka.state.currentDetailBrowserPosterColumn,
        posters = $('#boom-detail-browser img'),
        currentPosterIndex = posters.eq(column + 1).data('boom.index'),
        firstPosterIndex = posters.eq(1).data('boom.index'),
        snapshot = ka.lib.grid.getMovieListSnapshot(),
        isPosterGridOffscreen = ka.lib.browser.isExpanded();

    if (column > 2 || (firstPosterIndex == 0 && column > 0)) {
        ka.state.view = 'limbo';

        ka.lib.browser.backdrop.loadPessimistic(snapshot[currentPosterIndex - 1]);

        setTimeout(function () {
            if (isPosterGridOffscreen) {
                ka.lib._rotateLargePoster(snapshot[currentPosterIndex - 1], 0);
            }

            ka.lib.updateDetailBrowserInfo(snapshot[currentPosterIndex - 1], true);
            ka.lib._moveDetailBrowserFocus(posters.eq(column + 1), posters.eq(column), '-=160', isPosterGridOffscreen);
            ka.state.currentDetailBrowserPosterColumn -= 1;
        }, ka.settings.durationUltraShort);
    } else if (firstPosterIndex > 0) {
        ka.state.view = 'limbo';

        var keyPoster = snapshot[firstPosterIndex - 1].keyPoster;
        if (keyPoster in ka.cache.smallBrowserPosterByKey) {
            posters.eq(0).replaceWith(
                ka.cache.smallBrowserPosterByKey[keyPoster]
                    .css({width: 150, marginLeft: 10, webkitFilter: 'saturate(0%) opacity(0.5)'})
                    .data('boom.index', firstPosterIndex - 1)
            );
        } else {
            posters.eq(0).attr('src', '/movie/poster/' + keyPoster + '-' + (ka.state.isPosterScaled[keyPoster] ? 150 : 200) + '.image').data('boom.index', firstPosterIndex - 1);
        }

        ka.lib.browser.backdrop.loadPessimistic(snapshot[currentPosterIndex - 1]);

        setTimeout(function () {
            if (isPosterGridOffscreen) {
                ka.lib._rotateLargePoster(snapshot[firstPosterIndex + 1], 0);
            }

            ka.lib.updateDetailBrowserInfo(snapshot[firstPosterIndex + 1], true);
            ka.lib._animatePosterMove(
                 ka.lib._addBrowserGridDummy()
              , {translateZ: 0, width: 150, marginLeft: 10}
              , $('#boom-detail-browser img').eq(6)
              , posters.eq(3).get(0)
              , posters.eq(2).get(0)
              , isPosterGridOffscreen
            );
        }, ka.settings.durationUltraShort);
    }
};


ka.lib.moveDetailBrowserRight = function () {
    var column = ka.state.currentDetailBrowserPosterColumn,
        posters = $('#boom-detail-browser img'),
        currentPosterIndex = posters.eq(column + 1).data('boom.index'),
        lastPosterIndex = posters.last().data('boom.index'),
        snapshot = ka.lib.grid.getMovieListSnapshot(),
        isPosterGridOffscreen = ka.lib.browser.isExpanded();

    if ((column < 2 && snapshot.length > 2) || (lastPosterIndex == snapshot.length - 1 && lastPosterIndex - currentPosterIndex > 0)) {
        ka.state.view = 'limbo';

        ka.lib.browser.backdrop.loadPessimistic(snapshot[currentPosterIndex + 1]);

        setTimeout(function () {
            if (isPosterGridOffscreen) {
                ka.lib._rotateLargePoster(snapshot[currentPosterIndex + 1], 1);
            }

            ka.lib.updateDetailBrowserInfo(snapshot[currentPosterIndex + 1], true);
            ka.lib._moveDetailBrowserFocus(posters.eq(column + 1), posters.eq(column + 2), '+=160', isPosterGridOffscreen);
            ka.state.currentDetailBrowserPosterColumn += 1;
        }, ka.settings.durationUltraShort);
    } else if (posters.length == 6 && lastPosterIndex + 1 < snapshot.length) {
        ka.state.view = 'limbo';

        ka.lib._addBrowserGridImage(snapshot[lastPosterIndex + 1].keyPoster, lastPosterIndex + 1, true);

        ka.lib.browser.backdrop.loadPessimistic(snapshot[lastPosterIndex - 1]);

        setTimeout(function () {
            if (isPosterGridOffscreen) {
                ka.lib._rotateLargePoster(snapshot[lastPosterIndex - 1], 1);
            }

            ka.lib.updateDetailBrowserInfo(snapshot[lastPosterIndex - 1], true);
            ka.lib._animatePosterMove(
                posters.eq(0)
              , {translateZ: 0, width: 0, marginLeft: 0}
              , posters.eq(0)
              , posters.eq(3).get(0)
              , posters.eq(4).get(0)
              , isPosterGridOffscreen
            );
        }, ka.settings.durationUltraShort);
    }
};


ka.lib._moveDetailBrowserFocus = function (currentElement, targetElement, focusOffset, isPosterGridOffscreen) {
    ka.lib._focusOutImage(currentElement);
    ka.lib._focusInImage(targetElement);

    var duration = isPosterGridOffscreen ? 0 : ka.settings.durationNormal;
    $('#boom-detail-focus').velocity({translateZ: 0, left: focusOffset}, {duration: duration, complete: function () {
        if (!isPosterGridOffscreen) {
            ka.state.view = 'detail';
        }
    }});
};


ka.lib._animatePosterMove = function (animateElement, animateProperties, removeElement, previouslyFocusedPoster, upcomingFocusedPoster, isPosterGridOffscreen) {
    var duration = isPosterGridOffscreen ? 0 : ka.settings.durationNormal;

    animateElement.velocity(animateProperties, {
        duration: duration
      , progress: function (elements, percentComplete) {
            if (percentComplete < 1) {
                previouslyFocusedPoster.style.webkitFilter = 'saturate(' + (100 - Math.round(percentComplete * 100)) + '%) opacity(' + Math.round(100 - 50 * percentComplete) / 100 + ')';
                upcomingFocusedPoster.style.webkitFilter = 'saturate(' + Math.round(percentComplete * 100) + '%) opacity(' + Math.round(50 + 50 * percentComplete) / 100 + ')';
            }
        }
      , complete: function () {
            previouslyFocusedPoster.style.webkitFilter = 'saturate(0%) opacity(0.5)';
            upcomingFocusedPoster.style.webkitFilter = 'none';

            var src = removeElement.attr('src');
            if (src) {
                ka.lib._detachSmallBrowserPoster(null, removeElement);
            } else {
                removeElement.remove();
            }

            if (!isPosterGridOffscreen) {
               ka.state.view = 'detail';
            }
    }});
};


ka.lib._focusInImage = function (targetElement) {
    targetElement.velocity({translateZ: 0}, {
        duration: ka.settings.durationNormal
      , progress: function (elements, percentComplete) {
            elements[0].style.webkitFilter = 'saturate(' + Math.round(percentComplete * 100) + '%) opacity(' + Math.round(50 + 50 * percentComplete) / 100 + ')';
        }
      , complete: function (elements) {
            elements[0].style.webkitFilter = 'none';
        }
    });
};


ka.lib._focusOutImage = function (targetElement) {
    targetElement.velocity({translateZ: 0}, {
        duration: ka.settings.durationNormal
      , progress: function (elements, percentComplete) {
            elements[0].style.webkitFilter = 'saturate(' + (100 - Math.round(percentComplete * 100)) + '%) opacity(' + Math.round(100 - 50 * percentComplete) / 100 + ')';
        }
    });
};


ka.lib._rotateLargePoster = function (movieObj, direction) {
    var startAngleNew, targetAngleOld, targetFunctionNew, image;

    if (direction) {
        startAngleNew = 90;
        targetAngleOld = -90;
        targetFunctionNew = function (percentage) { return Math.max(0, 85 - percentage * 90); };
    } else {
        startAngleNew = -85;
        targetAngleOld = 90;
        targetFunctionNew = function (percentage) { return Math.min(0, percentage * 90 - 85); };
    }

    if (movieObj.keyPoster in ka.cache.largeBrowserPosterByKey) {
        image = ka.cache.largeBrowserPosterByKey[movieObj.keyPoster]
                    .css('webkitTransform', 'rotateY(' + startAngleNew + 'deg) translateZ(150px) scale(0.9225)');
    } else {
        image = $('<img>', {
            src: '/movie/poster/' + movieObj.keyPoster + '-' + (ka.state.isPosterScaled[movieObj.keyPoster] ? 300 : 200) + '.image'
          , css: {
                backgroundColor: '#' + (movieObj.primaryPosterColor || '000000')
              , webkitTransform: 'rotateY(' + startAngleNew + 'deg) translateZ(150px) scale(0.9225)'
            }
          , load: ka.lib.browser.poster.onLoaded
        });
    }

    try {
        var oldPosterStyle = $('#boom-detail-large-poster img').eq(0).get(0).style,
            newPosterStyle = image[['prependTo', 'appendTo'][direction]]('#boom-detail-large-poster').get(0).style;
    } catch (e) {
        console.error('Could not access style properties of large posters.');
    }

    $('#boom-detail-large-poster img').eq(!direction | 0).velocity({dummy: 0}, {
        delay: ka.settings.durationUltraShort
      , duration: ka.settings.durationNormal
      , progress: function (elements, percentage) {
            oldPosterStyle.webkitTransform = 'rotateY(' + (percentage * targetAngleOld) + 'deg) translateZ(150px) scale(0.9225)';
            newPosterStyle.webkitTransform = 'rotateY(' + targetFunctionNew(percentage) + 'deg) translateZ(150px) scale(0.9225)';

            if (direction) {
                oldPosterStyle.webkitFilter = 'brightness(' + (1 + percentage * 0.25) + ') contrast(' + (1 - percentage * 0.25) + ')';
                newPosterStyle.webkitFilter = 'brightness(' + (0.25 + percentage * 0.75) + ')';
            } else {
                oldPosterStyle.webkitFilter = 'brightness(' + (1 - percentage * 0.75) + ')';
                newPosterStyle.webkitFilter = 'brightness(' + (1.25 - percentage * 0.25) + ') contrast(' + (0.75 + percentage * 0.25) + ')';
            }
        }
      , complete: function () {
            var key = $(this).attr('src').match(/\movie\/poster\/(.*?)-\d{2,3}\.image/)[1];
            if (!!key && $(this).data('boom.isLoaded')) {
                ka.cache.largeBrowserPosterByKey[key] = $(this).css('webkitFilter', 'none').detach();
            } else {
                $(this).remove();
            }

            newPosterStyle.webkitTransform = 'none';
            newPosterStyle.webkitFilter = 'none';

            ka.state.view = 'detail';
        }
    });
};


ka.lib._detachSmallBrowserPoster = function (index, element) {
    if (index === 0) {
        return;
    } else if (index !== null) {
        element = $(element);
    }
    ka.cache.smallBrowserPosterByKey[element.attr('src').match(/\movie\/poster\/(.*?)-\d{2,3}\.image/)[1]] = element.detach();
};


ka.lib.toggleAvailableStreams = function () {
    if (ka.state.view == 'select-stream') {
        ka.state.view = 'limbo';

        $('#boom-detail-focus').velocity({opacity: 1}, ka.settings.durationShort);

        $('#boom-detail-available-streams').velocity('transition.expandOut', {duration: ka.settings.durationShort, display: 'none', complete: function () {
            ka.state.view = 'detail';
        }});
        $('#boom-detail-buttons-shade').velocity({opacity: 0}, {duration: ka.settings.durationShort, display: 'none', complete: function () {

        }});
    } else {
        ka.state.view = 'limbo';

        var movieObj = ka.data.byId[$('#boom-movie-detail').data('boom.id')],
            height = ka.lib.browser.isHidden() ? 1080 : ka.lib.browser.isExpanded() ? 610 : 833;
        $('#boom-detail-available-streams, #boom-detail-buttons-shade').velocity({height: height}, {duration: 0, complete: function () {
            $('#boom-detail-focus').velocity({opacity: 0}, ka.settings.durationShort);

            $('#boom-detail-buttons-shade').css('display', 'block').velocity({opacity: 0.5}, {duration: ka.settings.durationShort, complete: function () {
                $.getJSON(
                    '/movie/' + movieObj.id + '/get-available-versions'
                  , function (versions) {
                        $('#boom-detail-available-streams .boom-button').slice(1).remove();

                        for (var version, index = 0; version = versions[index]; index++) {
                            $('<div>', {
                                text: version[0]
                              , class: 'boom-button'
                              , data: {
                                    'boom.stream': version[1]
                                  , 'boom.color': '#' + movieObj.primaryPosterColor
                                  , 'boom.type': 'stream'
                                }
                            }).appendTo('#boom-detail-available-streams');
                        }

                        if (movieObj.trailer) {
                            $('#boom-detail-watch-trailer').addClass('boom-active').css('display', 'block').data('boom.color', '#' + movieObj.primaryPosterColor);
                        } else {
                            $('#boom-detail-watch-trailer').removeClass('boom-active').css('display', 'none');
                            $('#boom-detail-available-streams .boom-button:nth-child(2)').addClass('boom-active');
                        }

                        var selected = $('#boom-detail-available-streams .boom-active');
                        selected.css('backgroundColor', selected.data('boom.color')).data('type');

                        $('#boom-detail-available-streams').velocity('transition.expandIn', {display: 'flex', duration: ka.settings.durationShort, complete: function () {
                            ka.state.view = 'select-stream';
                        }});
                    }
                );
            }});
        }});
    }
};


ka.lib.moveStreamSelectionUp = function () {
    var index = $('#boom-detail-available-streams .boom-active').index('#boom-detail-available-streams .boom-button:visible');
    if (index > 0) {
        var selected = $('#boom-detail-available-streams .boom-button:visible')
            .removeClass('boom-active').css('backgroundColor', 'transparent')
            .eq(index - 1);
        selected.addClass('boom-active').css('backgroundColor', selected.data('boom.color'));
    }
};


ka.lib.moveStreamSelectionDown = function () {
    var index = $('#boom-detail-available-streams .boom-active').index('#boom-detail-available-streams .boom-button:visible');
    if (index < $('#boom-detail-available-streams .boom-button:visible').size() - 1) {
        var selected = $('#boom-detail-available-streams .boom-button:visible')
            .removeClass('boom-active').css('backgroundColor', 'transparent')
            .eq(index + 1);
        selected.addClass('boom-active').css('backgroundColor', selected.data('boom.color'));
    }
};