(function (undefined) {

    pl.extend(ke.templates, {
        get helpSelectedTooltip() {
            return '\
        <div class="<%=prefix%>t <%=prefix%>help-selected-wrap <%=prefix%>hsw-<%=ttid%>">\
          <div class="<%=prefix%>t <%=prefix%>help-inside-layout <%=prefix%>hil-<%=ttid%>">\
          <div class="<%=prefix%>unpinned-utils">\
                <div class="<%=prefix%>pro-img"></div>\
                <div class="<%=prefix%>close-unpinned"></div>\
            </div>\
            <div class="<%=prefix%>utils">\
                <div title="<%=title_listen_original%>" class="<%=prefix%>util-butt0n <%=prefix%>listen-original" data-from="<%=from%>"></div>\
                <div title="<%=title_settings%>" class="<%=prefix%>util-butt0n <%=prefix%>settings"></div>\
                <div title="<%=title_unpin%>" class="<%=prefix%>util-butt0n <%=prefix%>unpin"></div>\
                <div title="<%=title_show_reversed%>" class="<%=prefix%>show-reversed">\
                    <img class="<%=prefix%>flag <%=prefix%>from-flag">\
                    <div class="<%=prefix%>dir-arrow"></div>\
                    <img class="<%=prefix%>flag <%=prefix%>to-flag">\
                </div>\
            </div>\
            <div class="<%=prefix%>trVisibleLayout" id="<%=prefix%>trVisibleLayout-<%=ttid%>">\
              <div class="<%=prefix%>trEntireLayout" id="<%=prefix%>trEntireLayout-<%=ttid%>">\
                <div class="<%=prefix%>t <%=prefix%>content-layout <%=prefix%>content-layout-<%=ttid%>">\
                <%=content%></div>\
              </div>\
            </div>\
            \
            <div class="<%=prefix%>tr-scrollbar" id="<%=prefix%>tr-scrollbar-<%=ttid%>">\
             <div class="<%=prefix%>track" id="<%=prefix%>track-<%=ttid%>">\
              <div class="<%=prefix%>dragBar" id="<%=prefix%>dragBar-<%=ttid%>"></div>\
             </div>\
            </div>\
          </div>\
          \
          <div class="<%=prefix%>netflix-buttons <%=prefix%>nf-<%=ttid%>">\
                <div class="<%=prefix%>netflix-button <%=prefix%>netflix-save t-<%=ttid%>"><%=netflix_save%></div>\
                <div class="<%=prefix%>netflix-button <%=prefix%>netflix-continue"><%=netflix_continue%></div>\
                <div class="<%=prefix%>netflix-words">view saved words →</div>\
          </div>\
          \
          <div class="<%=prefix%>info-warn <%=prefix%>ddopt-<%=ttid%> <%=prefix%>hide" data-option="double_click">\
            <span title="<%=dd_localized_desc%>"><%=dd_localized%></span>\
            <div class="<%=prefix%>close-info-warn <%=prefix%>close-dd-option" data-ttid="<%=ttid%>"></div>\
          </div>\
          <div class="<%=prefix%>info-warn <%=prefix%>selopt-<%=ttid%> <%=prefix%>hide" data-option="selection">\
            <span title="<%=sel_localized_desc%>"><%=sel_localized%></span>\
            <div class="<%=prefix%>close-info-warn <%=prefix%>close-sel-option" data-ttid="<%=ttid%>"></div>\
          </div>\
          \
          <div class="<%=prefix%>info-warn <%=prefix%>iw-<%=ttid%> <%=prefix%>hide" data-option="localized">\
            <a target="_blank" title="<%=ti_localized_desc%>"><%=ti_localized%></a>\
            <div class="<%=prefix%>close-info-warn <%=prefix%>close-loc-option" data-ttid="<%=ttid%>"></div>\
          </div>\
          <div class="<%=prefix%>loading"><div class="<%=prefix%>mate-loading"></div></div>\
          <div class="<%=prefix%>offline"><span><%=l_offline%></span></div>\
        </div>\
      ';
        }
    });

})();