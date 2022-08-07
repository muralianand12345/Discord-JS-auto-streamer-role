module.exports = {
  name: 'ready',
  async execute(client) {

    try {
      const YTRoleId = client.config.STREAMER.ROLE.YOUTUBER;
      const GuildId = client.config.STREAMER.GUILD;
      const GuildInfo = await client.guilds.cache.get(GuildId);
      const YTRole = await GuildInfo.roles.cache.find(role => role.id == YTRoleId);
      const Role_Total = await YTRole.members.map(m => m.user);

      async function YTUsers(Role) {
        for (var i = 0; i < Role.length; i++) {
          const Mention = await client.guilds.cache.get(GuildId).members.cache.get(Role[i].id);
          if (Mention.presence == null) {
          } else {

            //Functions                   
            async function AddRole() {
              const StreamRoleId = client.config.STREAMER.ROLE.STREAM;
              if (Mention.roles.cache?.has(StreamRoleId)) {

              } else {
                let streamRole = await GuildInfo.roles.cache.get(StreamRoleId);
                await Mention.roles.add(streamRole).catch(err => {
                  console.log(`Add role Error ${err}`);
                });
              }
            }

            async function RemoveRole() {
              const StreamRoleId = client.config.STREAMER.ROLE.STREAM;
              let streamRole = await GuildInfo.roles.cache.get(StreamRoleId);
              await Mention.roles.remove(streamRole).catch(err => {
                console.log(`Remove role Error ${err}`);
              });
            }

            var Bool = false;
            Mention.presence.activities.forEach(activity => {
              if (activity.type.includes("STREAMING")) {
                return Bool = true;
              }
            });

            if (Bool == true) {
              await AddRole().catch(err => {
                console.log(`Add role Error Bool ${err}`);
              });


            } else if (Bool == false) {
              await RemoveRole().catch(err => {
                console.log(`Remove role Error Bool ${err}`);
              });
            } else {
              console.log("ERROR");
            }
          }
        }
      }

      const Interval = client.config.STREAMER.UPDATE_INTERVAL;
      setInterval(async () => {
        await YTUsers(Role_Total)
      }, Interval);

    } catch (err) {
      console.log(err);
    }
  }
}