"use strict";

import { resizeImage } from "./attachment/image.js";
import { profile } from "./profile.js";

document.addEventListener("DOMContentLoaded", function () {
  var navbarAvatar = document.getElementById("toolbar-avatar");
  var navbarUsername = document.getElementById("toolbar-username");

  OrchidServices.getWithUpdate(
    "profile/" + OrchidServices.userId(),
    function (udata) {
      navbarAvatar.src = udata.profile_picture;
      navbarUsername.innerText = udata.username;
    }
  );

  // Chat functionality
  var isDarkMode = localStorage.getItem("ws.darkMode") === "true";
  document.querySelector(':root').dataset.theme = isDarkMode ? 'dark' : 'light';

  var NOTIFICATION_SOUND = new Audio("resources/notifier_wos.wav");
  var WOS_MSG_SENT = new Audio("resources/wos_msg_sent.wav");
  var splashScreen = document.getElementById("splash-screen");

  var currentId;
  var currentChannel;
  var friendsButton = document.getElementById("friends-list");
  var joinGroupButton = document.getElementById("join-group");
  var serverGroups = document.getElementById("servers");
  var serverTitle = document.getElementById("server-title");
  var serverList = document.getElementById("server-list");
  var messages = document.getElementById("messages");
  friendsButton.addEventListener("click", function () {
    var selected = serverGroups.querySelector(".selected");
    if (selected) {
      selected.classList.remove("selected");
    }

    serverList.innerHTML = "";
    serverTitle.dataset.l10nId = "personal";
    var header = document.createElement("header");
    header.dataset.l10nId = "friends";
    serverList.appendChild(header);

    OrchidServices.getWithUpdate(
      "profile/" + OrchidServices.userId(),
      function (udata) {
        if (udata && udata.friends) {
          var entries = Object.entries(udata.friends);
          entries.forEach(function (entry) {
            var friend = document.createElement("li");
            friend.classList.add("user");
            friend.dataset.origin = entry[0];
            OrchidServices.getWithUpdate(
              "profile/" + entry[0],
              function (udata) {
                friend.style.setProperty(
                  "--avatar-url",
                  "url(" + udata.profile_picture + ")"
                );
                friend.innerText = udata.username;
                friend.dataset.status = udata.is_online ? "online" : "";
              }
            );
            friend.addEventListener("click", function (evt) {
              loadDirectMessages(entry[0], friend);
              textInput.focus();
            });
            serverList.appendChild(friend);
          });
        }
      }
    );
  });
  friendsButton.click();

  joinGroupButton.addEventListener("click", function () {
    var joinPrompt = prompt(
      "Add a friend by typing their email or number using #\nAnd create a server path using @"
    );
    if (joinPrompt.startsWith("#")) {
      OrchidServices.getWithUpdate("profile/", function (data) {
        var entries = Object.entries(data);
        entries.forEach(function (entry) {
          if (
            joinPrompt.substring(1) == entry[1].email ||
            joinPrompt.substring(1) == entry[1].phone_number
          ) {
            OrchidServices.set(
              "profile/" + OrchidServices.userId() + "/friends/" + entry[0],
              {
                messages: {},
              }
            );
          }
        });
      });
    } else if (joinPrompt.startsWith("@")) {
      var uuid = OrchidServices._generateUUID();
      OrchidServices.set("chat_groups/" + uuid, {
        name: joinPrompt.substring(1),
        icon:
          "https://ui-avatars.com/api/?name=" +
          joinPrompt.substring(1) +
          "&background=random",
        channels: {
          0: {
            name: "Chatting",
            type: "header",
          },
          1: {
            name: "General",
            type: "text_chat",
          },
          2: {
            name: "Off Topic",
            type: "text_chat",
          },
        },
        messages: {},
      });
      OrchidServices.set("profile/" + OrchidServices.userId(), {
        chat_groups: { [uuid]: "" },
      });
    }
  });

  var content = document.getElementById("content");
  var menuButton = document.getElementById("menu-button");
  var chatTitle = document.getElementById("chat-title");
  menuButton.addEventListener("click", function () {
    content.classList.toggle("visible");
  });

  var chatForm = document.getElementById("chat-footer-form");
  var textInput = document.getElementById("text-input");
  var attachmentsButton = document.getElementById("attachments-button");
  chatForm.onsubmit = function (evt) {
    evt.preventDefault();
    textInput.focus();
    if (textInput.value !== "") {
      sendMessage(textInput.value);
      textInput.value = "";
    }
  };

  textInput.addEventListener("keydown", function () {
    if (textInput.value !== "") {
      OrchidServices.set("profile/" + OrchidServices.userId(), {
        is_typing: true,
      });
      setTimeout(function () {
        OrchidServices.set("profile/" + OrchidServices.userId(), {
          is_typing: false,
        });
      }, 3000);
    } else {
      OrchidServices.set("profile/" + OrchidServices.userId(), {
        is_typing: false,
      });
    }
  });

  attachmentsButton.addEventListener("click", function (evt) {
    evt.preventDefault();
    var fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".png,.jpg,.jpeg,.webp,.gif";

    fileInput.addEventListener("change", function () {
      var file = fileInput.files[0];
      var reader = new FileReader();
      reader.addEventListener("load", function (e) {
        var result = e.target.result;
        resizeImage(result, function (image) {
          sendMessage(image, "image");
        });
      });
      reader.readAsDataURL(file);
    });
    fileInput.click();
  });

  OrchidServices.getWithUpdate(
    "profile/" + OrchidServices.userId(),
    function (data) {
      if (data.chat_groups) {
        splashScreen.classList.add("hidden");
        var entries = Object.entries(data.chat_groups);

        serverGroups.innerHTML = "";
        entries.forEach(function (entry) {
          OrchidServices.getWithUpdate(
            "chat_groups/" + entry[0],
            function (data) {
              if (data !== null) {
                var serverExists = serverGroups.querySelector(
                  '[data-origin="' + entry[0] + '"]'
                );
                if (!serverExists) {
                  var server = document.createElement("li");
                  server.dataset.origin = entry[0];
                  if (data.icon) {
                    server.style.backgroundImage = "url(" + data.icon + ")";
                  }
                  server.title = data.name;
                  server.addEventListener("click", function () {
                    loadGroup(entry[0], "", server);
                  });

                  var pingAmount = 0;
                  var pings = document.createElement("em");
                  pings.style.display = "none";
                  pings.innerText = 0;
                  server.appendChild(pings);

                  OrchidServices.getWithUpdate(
                    "chat_groups/" + entry[0],
                    function (data) {
                      if (data) {
                        var entries = Object.entries(data.channels);
                        entries.forEach(function (entry1) {
                          OrchidServices.getWithUpdate(
                            "chat_groups/" + entry[0],
                            function (data) {
                              if (data.messages[entry1[0]]) {
                                pings.style.display = "none";
                                pingAmount = 0;
                                pings.innerText = pingAmount;

                                var entries = Object.entries(
                                  data.messages[entry1[0]]
                                );
                                entries.forEach(function (entry, index) {
                                  OrchidServices.getWithUpdate(
                                    "chat_groups/" + id,
                                    function (data2) {
                                      if (
                                        !data2.messages[entry1[0]][entry[0]]
                                          .seen_by[OrchidServices.userId()]
                                      ) {
                                        pings.style.display = "block";
                                        pingAmount++;
                                        pings.innerText = pingAmount;
                                      }
                                    }
                                  );
                                });
                              }
                            }
                          );
                        });
                      }
                    }
                  );

                  serverGroups.appendChild(server);
                }
              }
            }
          );
        });
      }
    }
  );

  function sendNotification(avatar, username, message) {
    console.log(avatar + " " + username + " " + message);
    if (!window.Notification) {
      console.log("Browser does not support notifications.");
    } else {
      // check if permission is already granted
      if (Notification.permission === "granted") {
        var notify = new Notification(username, {
          body: message,
          icon: avatar,
        });
        if (document.visibilityState !== "visible") {
          NOTIFICATION_SOUND.play();
        }
      } else {
        // request permission from user
        Notification.requestPermission()
          .then(function (p) {
            if (p === "granted") {
              var notify = new Notification(username, {
                body: message,
                icon: avatar,
              });
              if (document.visibilityState !== "visible") {
                NOTIFICATION_SOUND.play();
              }
            } else {
              console.log("User blocked notifications.");
            }
          })
          .catch(function (err) {
            console.error(err);
          });
      }
    }
  }

  function loadDirectMessages(id, item) {
    var backupItem = document.querySelector(
      '[data-origin="' + currentId + '"]'
    );
    window.history.pushState({}, "", "?directmessage=" + currentId);

    var selected = serverList.querySelector(".selected");
    if (selected) {
      selected.classList.remove("selected");
    }
    content.classList.add("visible");

    OrchidServices.getWithUpdate("profile/" + id, function (data) {
      chatTitle.innerText = data.username;
      document.title = data.username;

      if (item) {
        item.classList.add("selected");
      } else if (backupItem) {
        backupItem.classList.add("selected");
      }
    });

    var pingAmount = 0;
    var pings = document.createElement("em");
    pings.style.display = "none";
    pings.innerText = 0;
    if (item) {
      item.appendChild(pings);
    } else if (backupItem) {
      backupItem.appendChild(pings);
    }

    var isMessagedFirst = null;
    OrchidServices.getWithUpdate(
      "profile/" + OrchidServices.userId() + "/friends/" + id,
      function (data) {
        if (data) {
          currentId = data;
          currentChannel = data;
          console.log(data);
          initMessages(data);
        }
      }
    );

    function initMessages(directMessageId) {
      OrchidServices.getWithUpdate(
        "chat_groups/" + directMessageId,
        function (data) {
          messages.innerHTML = "";
          if (data) {
            var messageEntries = Object.entries(data.messages[directMessageId]);
            messageEntries = messageEntries.sort(function(a, b) {
              return parseFloat(b[1].date_sent) - parseFloat(a[1].date_sent);
            }).reverse();

            messageEntries.forEach(function (messageEntry) {
              var date = new Date(messageEntry[1].date_sent);
              var formatted =
                date
                  .getUTCFullYear()
                  .toLocaleString(
                    navigator.language == "ar" ? "ar-SA" : undefined
                  ) +
                "/" +
                (date.getMonth() + 1).toLocaleString(
                  navigator.language == "ar" ? "ar-SA" : undefined
                ) +
                "/" +
                date
                  .getUTCDate()
                  .toLocaleString(
                    navigator.language == "ar" ? "ar-SA" : undefined
                  ) +
                " - " +
                date
                  .getUTCHours()
                  .toLocaleString(
                    navigator.language == "ar" ? "ar-SA" : undefined
                  ) +
                ":" +
                date
                  .getMinutes()
                  .toLocaleString(
                    navigator.language == "ar" ? "ar-SA" : undefined
                  );
              drawMessage({
                id: messageEntry[0],
                date_sent: formatted,
                data: messageEntry[1].data,
                sender_id: messageEntry[1].sender_id,
                type: messageEntry[1].type,
                edited: messageEntry[1].edited,
              });
            });
          }
        }
      );

      OrchidServices.getWithUpdate(
        "chat_groups/" + directMessageId,
        function (data) {
          if (data) {
            pings.style.display = "none";
            pingAmount = 0;
            pings.innerText = pingAmount;

            var entries = Object.entries(data.messages[directMessageId]);
            entries.forEach(function (entry, index) {
              OrchidServices.getWithUpdate(
                "chat_groups/" + directMessageId,
                function (data1) {
                  if (
                    !data1.messages[directMessageId][entry[0]].seen_by[
                      OrchidServices.userId()
                    ]
                  ) {
                    pings.style.display = "block";
                    pingAmount++;
                    pings.innerText = pingAmount;
                    if (index == 0) {
                      if (document.visibilityState !== "visible") {
                        OrchidServices.getWithUpdate(
                          "profile/" + messageEntry[1].sender_id,
                          function (udata) {
                            OrchidServices.getWithUpdate(
                              "chat_groups/" + directMessageId,
                              function (cdata) {
                                if (!wasSeen) {
                                  sendNotification(
                                    udata.profile_picture,
                                    udata.username,
                                    cdata.messages[directMessageId][
                                      messageEntry[0]
                                    ].seen_by[OrchidServices.userId()]
                                  );
                                }
                              }
                            );
                          }
                        );
                      }
                    }
                  }
                }
              );
            });
          }
        }
      );
    }
  }

  function loadGroup(id, channel = "", element) {
    currentId = id;
    var backupItem = document.querySelector(
      '[data-origin="' + currentId + '"]'
    );

    var selected = serverGroups.querySelector(".selected");
    if (selected) {
      selected.classList.remove("selected");
    }

    OrchidServices.getWithUpdate("chat_groups/" + id, function (data) {
      serverTitle.innerText = data.name;
      serverTitle.dataset.l10nId = null;

      if (element) {
        element.classList.add("selected");
      } else if (backupItem) {
        backupItem.classList.add("selected");
      }
    });

    OrchidServices.getWithUpdate(
      "profile/" + OrchidServices.userId() + "/chat_groups/" + id,
      function (data) {
        if (data) {
          currentChannel = data.selected_channel;
        } else {
          currentChannel = "";
        }
      }
    );

    OrchidServices.getWithUpdate("chat_groups/" + currentId, function (data) {
      if (data) {
        serverList.innerHTML = "";
        var entries = Object.entries(data.channels);
        entries.forEach(function (entry) {
          var channelName = entry[1].name.toLowerCase().replace(" ", "_");

          switch (entry[1].type) {
            case "header":
              var header = document.createElement("header");
              header.innerText = entry[1].name;
              serverList.appendChild(header);
              break;

            case "text_chat":
              var textChat = document.createElement("li");
              textChat.innerText = entry[1].name;
              textChat.addEventListener("click", function () {
                select();
                OrchidServices.set(
                  "profile/" + OrchidServices.userId() + "/chat_groups/" + id,
                  { selected_channel: currentChannel }
                );
              });
              serverList.appendChild(textChat);

              var pingAmount = 0;
              var pings = document.createElement("em");
              pings.style.display = "none";
              pings.innerText = pingAmount;
              textChat.appendChild(pings);

              OrchidServices.getWithUpdate(
                "chat_groups/" + id,
                function (data) {
                  if (data.messages[channelName]) {
                    pings.style.display = "none";
                    pingAmount = 0;
                    pings.innerText = pingAmount;

                    var entries = Object.entries(data.messages[channelName]);
                    entries.forEach(function (entry, index) {
                      OrchidServices.getWithUpdate(
                        "chat_groups/" + id,
                        function (data2) {
                          if (
                            !data.messages[channelName][entry[0]].seen_by[
                              OrchidServices.userId()
                            ]
                          ) {
                            pings.style.display = "block";
                            pingAmount++;
                            pings.innerText = pingAmount;
                            if (index == 0) {
                              if (document.visibilityState !== "visible") {
                                OrchidServices.getWithUpdate(
                                  "profile/" + messageEntry[1].sender_id,
                                  function (udata) {
                                    OrchidServices.getWithUpdate(
                                      "chat_groups/" + directMessageId,
                                      function (cdata) {
                                        if (!wasSeen) {
                                          sendNotification(
                                            udata.profile_picture,
                                            udata.username,
                                            cdata.messages[directMessageId][
                                              messageEntry[0]
                                            ].seen_by[OrchidServices.userId()]
                                          );
                                        }
                                      }
                                    );
                                  }
                                );
                              }
                            }
                          }
                        }
                      );
                    });
                  }
                }
              );

              if (currentId == id) {
                OrchidServices.getWithUpdate(
                  "profile/" + OrchidServices.userId() + "/chat_groups/" + id,
                  function (data) {
                    if (channel == channelName) {
                      select();
                    } else if (data.selected_channel == channelName) {
                      select();
                    }
                  }
                );
              }

              function select() {
                currentChannel = channelName;
                window.history.pushState(
                  {},
                  "",
                  "?group=" + id + "&channel=" + currentChannel
                );

                var selected = serverList.querySelector(".selected");
                if (selected) {
                  selected.classList.remove("selected");
                }
                textChat.classList.add("selected");

                content.classList.add("visible");
                chatTitle.innerText = entry[1].name;
                document.title = entry[1].name;
                OrchidServices.getWithUpdate(
                  "chat_groups/" + currentId,
                  function (data2) {
                    messages.innerHTML = "";
                    if (data2.messages[currentChannel]) {
                      var messageEntries = Object.entries(
                        data2.messages[currentChannel]
                      );
                      messageEntries = messageEntries.sort(function(a, b) {
                        return parseFloat(b[1].date_sent) - parseFloat(a[1].date_sent);
                      }).reverse();

                      messageEntries.forEach(function (messageEntry) {
                        var date = new Date(messageEntry[1].date_sent);
                        var formatted =
                          date
                            .getUTCFullYear()
                            .toLocaleString(
                              navigator.language == "ar" ? "ar-SA" : undefined
                            ) +
                          "/" +
                          (date.getMonth() + 1).toLocaleString(
                            navigator.language == "ar" ? "ar-SA" : undefined
                          ) +
                          "/" +
                          date
                            .getUTCDate()
                            .toLocaleString(
                              navigator.language == "ar" ? "ar-SA" : undefined
                            ) +
                          " - " +
                          date
                            .getUTCHours()
                            .toLocaleString(
                              navigator.language == "ar" ? "ar-SA" : undefined
                            ) +
                          ":" +
                          date
                            .getMinutes()
                            .toLocaleString(
                              navigator.language == "ar" ? "ar-SA" : undefined
                            );
                        drawMessage({
                          id: messageEntry[0],
                          date_sent: formatted,
                          data: messageEntry[1].data,
                          sender_id: messageEntry[1].sender_id,
                          type: messageEntry[1].type,
                          edited: messageEntry[1].edited,
                        });
                      });
                    }
                  }
                );
                messages.scrollTop =
                  messages.scrollHeight -
                  messages.getBoundingClientRect().height;
                textInput.focus();
              }
              break;
          }
        });
      }
    });
  }

  var messageY = 0;
  function drawMessage(data) {
    var message = document.createElement("div");
    message.classList.add("message");
    if (data.sender_id == OrchidServices.userId()) {
      message.classList.add("yours");
    }
    messages.appendChild(message);

    var avatar = document.createElement("img");
    avatar.classList.add("avatar");
    avatar.loading = 'lazy';
    OrchidServices.getWithUpdate("profile/" + data.sender_id, function (udata) {
      avatar.src = udata.profile_picture;
    });
    avatar.addEventListener("click", function () {
      profile(data.sender_id);
    });
    message.appendChild(avatar);

    var content = document.createElement("div");
    content.classList.add("content");
    message.appendChild(content);

    var info = document.createElement("div");
    info.classList.add("info");
    content.appendChild(info);

    var username = document.createElement("span");
    username.classList.add("username");
    OrchidServices.getWithUpdate("profile/" + data.sender_id, function (udata) {
      username.innerText = udata.username;
    });
    info.appendChild(username);

    var date_sent = document.createElement("span");
    date_sent.innerText = data.date_sent;
    info.appendChild(date_sent);

    if (data.edited) {
      var edited = document.createElement("span");
      edited.dataset.l10nId = "edited";
      info.appendChild(edited);
    }

    switch (data.type) {
      case "image":
        var imageAttachment = document.createElement("img");
        imageAttachment.classList.add("image-attachment");
        imageAttachment.loading = 'lazy';
        imageAttachment.src = data.data;
        content.appendChild(imageAttachment);
        break;
      case "text":
      default:
        var context = document.createElement("p");
        context.classList.add("context");
        context.style.setProperty(
          "--message-context-width",
          context.getBoundingClientRect().width + "px"
        );
        content.appendChild(context);

        if (data.data) {
          var bold = /\*\*(.*?)\*\*/gm;
          var italic = /\*(.*?)\*/gm;
          var stroke = /\~\~(.*?)\~\~/gm;
          var underline = /\_\_(.*?)\_\_/gm;
          var pscript = /\+\+(.*?)\+\+/gm;
          var mscript = /\-\-(.*?)\-\-/gm;
          var mark = /\!\!(.*?)\!\!/gm;
          var link =
            /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
          var link2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
          var html = data.data.replace(bold, "<strong>$1</strong>");
          html = html.replace(italic, "<i>$1</i>");
          html = html.replace(stroke, "<del>$1</del>");
          html = html.replace(underline, "<u>$1</u>");
          html = html.replace(pscript, "<sup>$1</sup>");
          html = html.replace(mscript, "<sub>$1</sub>");
          html = html.replace(mark, "<mark>$1</mark>");
          html = html.replace(link, "<a href='$1'>$1</a>");
          html = html.replace(
            link2,
            '$1<a target="_blank" href="http://$2">$2</a>'
          );
          context.innerHTML = html;
        }
        break;
    }
    messages.scrollTop =
      messages.scrollHeight - messages.getBoundingClientRect().height;

    var viewers = document.createElement("div");
    viewers.classList.add("viewers");
    OrchidServices.getWithUpdate("chat_groups/" + currentId, function (vdata) {
      if (vdata.messages[currentChannel][data.id].seen_by) {
        var entries = Object.entries(
          vdata.messages[currentChannel][data.id].seen_by
        );
        entries.forEach(function (entry) {
          var viewer = document.createElement("div");
          OrchidServices.getWithUpdate("profile/" + entry[0], function (udata) {
            viewer.style.backgroundImage = "url(" + udata.profile_picture + ")";
            viewer.title = udata.username;
          });
          viewers.appendChild(viewer);
        });
      }
    });
    content.appendChild(viewers);

    message.style.setProperty("--message-y", messageY + "px");
    messageY += message.getBoundingClientRect().height + 24;

    if (document.visibilityState === "visible") {
      OrchidServices.set("chat_groups/" + currentId, {
        messages: {
          [currentChannel]: {
            [data.id]: {
              seen_by: {
                [OrchidServices.userId()]: true,
              },
            },
          },
        },
      });
    }

    // Toolbar
    if (data.sender_id == OrchidServices.userId()) {
      var toolbar = document.createElement("div");
      toolbar.classList.add("toolbar");
      message.appendChild(toolbar);

      var toolbarDelete = document.createElement("button");
      toolbarDelete.classList.add("danger");
      toolbarDelete.dataset.l10nId = "toolbar-delete";
      toolbarDelete.dataset.icon = "delete";
      toolbarDelete.addEventListener("click", function () {
        OrchidServices.set("chat_groups/" + currentId, {
          messages: {
            [currentChannel]: {
              [data.id]: null
            },
          },
        });
      });
      toolbar.appendChild(toolbarDelete);

      if (data.type == "text") {
        var toolbarEdit = document.createElement("button");
        toolbarEdit.dataset.l10nId = "toolbar-edit";
        toolbarEdit.dataset.icon = "edit";
        toolbarEdit.addEventListener("click", function () {
          context.contentEditable = true;
          context.focus();
          context.onkeypress = function (evt) {
            switch (evt.keyCode) {
              case 27:
                context.contentEditable = false;
                break;
              case 13:
                var bold = /\*\*(.*?)\*\*/gm;
                var italic = /\*(.*?)\*/gm;
                var stroke = /\~\~(.*?)\~\~/gm;
                var underline = /\_\_(.*?)\_\_/gm;
                var pscript = /\+\+(.*?)\+\+/gm;
                var mscript = /\-\-(.*?)\-\-/gm;
                var mark = /\!\!(.*?)\!\!/gm;
                var link =
                  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
                var link2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
                var html = context.innerText.replace(
                  bold,
                  "<strong>$1</strong>"
                );
                html = html.replace(italic, "<i>$1</i>");
                html = html.replace(stroke, "<del>$1</del>");
                html = html.replace(underline, "<u>$1</u>");
                html = html.replace(pscript, "<sup>$1</sup>");
                html = html.replace(mscript, "<sub>$1</sub>");
                html = html.replace(mark, "<mark>$1</mark>");
                html = html.replace(link, "<a href='$1'>$1</a>");
                html = html.replace(
                  link2,
                  '$1<a target="_blank" href="http://$2">$2</a>'
                );
                OrchidServices.set("chat_groups/" + currentId, {
                  messages: {
                    [currentChannel]: {
                      [data.id]: {
                        data: html,
                        edited: true,
                      },
                    },
                  },
                });
                break;
            }
          };
        });
        toolbar.appendChild(toolbarEdit);
      }
    }
  }

  function sendMessage(text, type = "text") {
    var dateSent = Date.now();
    OrchidServices.set("chat_groups/" + currentId, {
      messages: {
        [currentChannel]: {
          [dateSent]: {
            sender_id: OrchidServices.userId(),
            data: text,
            date_sent: dateSent,
            seen_by: {},
            type: type,
            edited: false,
          },
        },
      },
    });

    WOS_MSG_SENT.currentTime = 0;
    WOS_MSG_SENT.play();
    messages.scrollTop =
      messages.scrollHeight - messages.getBoundingClientRect().height;
  }

  function groupInvite(id, channel) {
    OrchidServices.set(
      "profile/" + OrchidServices.userId() + "/chat_groups/" + id,
      {
        selected_channel: channel,
      }
    );
  }

  if (location.search !== "") {
    var pramaters = location.search.split("?")[1];
    let params_arr = pramaters.split("&");
    for (let i = 0; i < params_arr.length; i++) {
      let pair = params_arr[i].split("=");
      if (pair[0] == "group") {
        if (pair[1]) {
          loadGroup(pair[1]);
        }
      }
      if (pair[0] == "directmessage") {
        if (pair[1]) {
          loadDirectMessages(pair[1]);
        }
      }
      if (pair[0] == "invite") {
        if (pair[1]) {
          var data = pair[1].split("/");
          groupInvite(data[0], data[1]);
        }
      }
    }
  }

  new EmojiPicker({
    trigger: [
      {
        selector: "#emojis-button",
        insertInto: "#text-input",
      },
    ],
    closeButton: true,
    //specialButtons: green
  });
});
