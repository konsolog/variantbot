const {SlashCommandBuilder, PermissionFlagsBits, TextChannel} = require('discord.js')
require('dotenv').config()
const mysql = require('mysql2')

module.exports = {
    data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Warn a person (Mod Only)')
        .addUserOption(op => 
            op
                .setName("target")
                .setDescription("Person to warn")
                .setRequired(true))
        .addStringOption(op => op
                .setName("reason")
                .setDescription("Reason of warn")
                .setRequired(false)
            )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
        .setDMPermission(false)
        ,
	async execute(interaction) {
        let reason = interaction.options.getString('reason')
        if (!reason) reason = "No reason provided."
        let user = interaction.options.getUser('target')
        let strikes = 0

        const connection = mysql.createConnection(process.env.DATABASE_URL)
        console.log('Connected to DB "Warns"')

        
        connection.query(
          `INSERT INTO Warns (user, reason) VALUES ('${user.id}', '${reason}');`
        )

        connection.query(`
          SELECT COUNT(id) FROM Warns WHERE user=${user.id};
        `,
        function(err, results, fields) {
            console.warn(results[Object.values(results)])
            strikes = results[0]["count(id)"]
          }
        )
		
        try {
            await interaction.reply({content: `<:CHECK:1110605208062525522> User ${user} has been warned for: \n\n${reason}`, ephemeral: false}); 
            await user.send(`<:WARNING:1110606751696433174> You have been warned in VariantCraft for: \n\n${reason} \n\nYou have received **${strikes} warns**. To appeal one of these warns, please message one of the admins: <@434608451541401610>, <@826748269354680333>, <@573351641248563202>`)
            console.log(`User ${user} has been warned`)
        } catch (e) {
            console.log(`Could not DM user ${user} about the warn but has been warned. ${e}`)
            await interaction.editReply({content: `<:CHECK:1110605208062525522> User ${user} has been warned for: \n\n${reason}\n\nBut could not be DMed.`, ephemeral: false}); 
        }
                
        connection.end()
	},
}