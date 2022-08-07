module.exports = {
  name: 'ready',
  async execute(client) {

    try {
      //Config Files
      const YTRoleId = client.config.STREAMER.ROLE.YOUTUBER;
      const GuildId = client.config.STREAMER.GUILD;
      const Interval = client.config.STREAMER.UPDATE_INTERVAL;

      //auto check after 20 secs
      var GuildInfo;
      var YTRole;
      var Role_Total;

      setInterval(async () => {
        return GuildInfo = await client.guilds.cache.get(GuildId);
      }, Interval);

      setInterval(async () => {
        YTRole = await GuildInfo.roles.cache.find(role => role.id == YTRoleId);
        return Role_Total = await YTRole.members.map(m => m.user);
      }, Interval);

      
      async function YTUsers(Role) {
        
        //per user
        for (var i = 0; i < Role.length; i++) {
          const Mention = await client.guilds.cache.get(GuildId).members.cache.get(Role[i].id);
          
          const ERROR_CHAN = client.config.ERR_CHAN;
          const err_log = client.channels.cache.get(ERROR_CHAN);

          //no presence or offline user
          if (Mention.presence == null) {
            //err_log.send({ content: `Null Presence of Offline`});
          } else {

            //Functions                   
            async function AddRole() {
              const ERROR_CHAN = client.config.ERR_CHAN;
              const err_log = client.channels.cache.get(ERROR_CHAN);
              const StreamRoleId = client.config.STREAMER.ROLE.STREAM;
              
              if (Mention.roles.cache?.has(StreamRoleId)) {
                return;
              } else {
                //give role
                let streamRole = await GuildInfo.roles.cache.get(StreamRoleId);
                await Mention.roles.add(streamRole).catch(err => {
                  console.log(`Add role Error ${err}`);
                });
                err_log.send({ content: `<@${Role[i].id}> Streamer Role Added` });
              }
            }

            async function RemoveRole() {
              const StreamRoleId = client.config.STREAMER.ROLE.STREAM;
              let streamRole = await GuildInfo.roles.cache.get(StreamRoleId);
              await Mention.roles.remove(streamRole).catch(err => {
                console.log(`Remove role Error ${err}`);
              });
            }

            //Boolean value
            //Checks the user for STREAMING type in presence
            var Bool = false;
            Mention.presence.activities.forEach(activity => {
              if (activity.type.includes("STREAMING")) {
                return Bool = true;
              }
            });

            //Add role or remove
            if (Bool == true) {
              await AddRole().catch(err => {
                err_log.send({ content: `**ERROR**\n${err}` });
              });

            } else if (Bool == false) {
              await RemoveRole().catch(err => {
                err_log.send({ content: `**ERROR**\n${err}` });
              });
            } else {
              err_log.send({ content: `**ERROR**\nReason: Bool is neither true nor false` });;
            }
          }
        }
        //--------------End of Per User Loop--------------
      }
      //--------------End of The Function--------------
      
      //Call function in a loop (every 20 seconds)
      setInterval(async () => {
        await YTUsers(Role_Total)
      }, Interval);

    } catch (err) {
      //Error catch
      console.log(err);
    }
  }
}
