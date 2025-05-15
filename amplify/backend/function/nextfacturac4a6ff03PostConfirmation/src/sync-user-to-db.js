// amplify/backend/function/TU_FUNCION_PostConfirmation/src/sync-user-to-db.js

const { Sequelize, DataTypes } = require('sequelize');

// Configuración de Sequelize (Leer desde variables de entorno)
// Es buena idea inicializarla fuera del handler para posible reutilización de conexión
// en ejecuciones "cálidas" de Lambda, pero Sequelize maneja el pooling.
let sequelizeInstance = null;

const getSequelize = () => {
    if (!sequelizeInstance) {
        console.log('[Sync DB] Inicializando instancia de Sequelize...');
        sequelizeInstance = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
            host: process.env.DB_HOST,
            dialect: 'postgres',
            logging: console.log, // Log SQL para depuración
            dialectOptions: {
              ssl: { require: true, rejectUnauthorized: false }, // Ajusta rejectUnauthorized en prod
              keepAlive: true,
            },
            pool: { max: 2, min: 0, idle: 10000, acquire: 20000 }, // Pool más pequeño para Lambda
        });
        console.log('[Sync DB] Instancia de Sequelize creada.');
    }
    return sequelizeInstance;
};

// Definición del Modelo User (debe coincidir con tu definición en app.js)
const defineUserModel = (sequelize) => {
    return sequelize.define('User', {
        cognitoSub: { type: DataTypes.STRING, allowNull: false, unique: true, primaryKey: true },
        name: { type: DataTypes.STRING, field: 'name', allowNull: true },
        email: { type: DataTypes.STRING, field: 'email', allowNull: false, unique: true },
        username: { type: DataTypes.STRING, field: 'username', allowNull: true },
        restaurantName: { type: DataTypes.STRING, field: 'restaurantname', allowNull: true },
        phoneNumber: { type: DataTypes.STRING, field: 'phonenumber', allowNull: true },
        role: { type: DataTypes.STRING, field: 'role', defaultValue: 'RestaurantOwners' },
        createdAt: { type: DataTypes.DATE, field: 'createdat' },
        updatedAt: { type: DataTypes.DATE, field: 'updatedat' },
    }, {
        tableName: 'users',
        freezeTableName: true,
        timestamps: true,
        indexes: [ { fields: ['email'], unique: true } ]
    });
};


/**
 * @type {import('@types/aws-lambda').PostConfirmationTriggerHandler}
 */
exports.handler = async (event) => {
    console.log('[Sync DB] Recibido evento PostConfirmation:', JSON.stringify(event, null, 2));

    // Solo actuar en la confirmación del registro
    if (event.triggerSource === 'PostConfirmation_ConfirmSignUp') {
        const attributes = event.request.userAttributes;
        const cognitoSub = attributes.sub;
        const email = attributes.email;
        const name = attributes.name;
        const username = event.userName; // Username de Cognito
        const phoneNumber = attributes.phone_number;
        const restaurantName = attributes['custom:restaurantName']; // Acceso al atributo personalizado

        // Validar datos mínimos
        if (!cognitoSub || !email) {
            console.error('[Sync DB] Faltan atributos esenciales (sub o email) en el evento.');
            // Devolver el evento original para no bloquear el flujo de Cognito si fallamos aquí
            return event;
        }

        console.log(`[Sync DB] Procesando usuario confirmado: Sub=<span class="math-inline">\{cognitoSub\}, Email\=</span>{email}`);

        let sequelize;
        try {
            sequelize = getSequelize();
            const User = defineUserModel(sequelize);

            // Intentar sincronizar el modelo (opcional, mejor usar migraciones)
            // await User.sync({ alter: true }); // Podría ser lento en Lambda

            // Usar findOrCreate para manejar casos donde la Lambda reintenta o ya existe el registro
            const [user, created] = await User.findOrCreate({
                where: { cognitoSub: cognitoSub },
                defaults: {
                    cognitoSub: cognitoSub,
                    email: email?.toLowerCase(), // Guardar en minúsculas
                    name: name,
                    username: username,
                    phoneNumber: phoneNumber,
                    restaurantName: restaurantName,
                    role: 'RestaurantOwners' // Asignar rol por defecto de la aplicación
                }
            });

            if (created) {
                console.log(`[Sync DB] Nuevo usuario insertado en RDS con cognitoSub: ${cognitoSub}`);
            } else {
                console.log(`[Sync DB] Usuario con cognitoSub ${cognitoSub} ya existía. Actualizando si es necesario...`);
                // Opcional: Actualizar campos si pueden cambiar entre confirmación y ejecución lambda
                let updated = false;
                if (name && user.name !== name) { user.name = name; updated = true; }
                if (phoneNumber && user.phoneNumber !== phoneNumber) { user.phoneNumber = phoneNumber; updated = true; }
                if (restaurantName && user.restaurantName !== restaurantName) { user.restaurantName = restaurantName; updated = true; }
                // No actualizar email si es PK o identificador único conflictivo
                if (updated) {
                    await user.save();
                    console.log(`[Sync DB] Datos actualizados para cognitoSub: ${cognitoSub}`);
                }
            }

        } catch (error) {
            console.error(`[Sync DB] Error al procesar usuario ${cognitoSub} en la base de datos:`, error);
            // Considera enviar a una cola de mensajes muertos (DLQ) o loguear para revisión manual.
            // Es importante devolver el evento a Cognito para no fallar el flujo del usuario.
        } finally {
             // Considerar cerrar la conexión si se maneja manualmente el pool
             // if (sequelize) await sequelize.close(); // Usualmente no necesario con el pooling de Sequelize
        }
    } else {
        console.log("[Sync DB] Evento no es PostConfirmation_ConfirmSignUp, omitiendo sincronización de BD.");
    }

    // Devolver siempre el evento original a Cognito
    console.log("[Sync DB] Retornando evento a Cognito.");
    return event;
};