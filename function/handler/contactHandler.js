const pool = require("../../db");

const getContact = async () => {
  try {
    const contacts = await pool.query(`SELECT name, email FROM contact`);

    return contacts.rows;
  } catch (error) {
    throw error;
  }
};

const getContactDetail = async (userID) => {
  const user = await pool.query(
    `SELECT * FROM contact WHERE name = '${userID}'`
  );

  return user.rows[0];
};

const addContact = async (contact, img) => {
  await pool.query(`INSERT INTO public.contact(
    name, email, mobile, image)
    VALUES ('${contact.name}', '${contact.email}', '${contact.mobile}','${img}')`);
};

const deleteContact = async (userID) => {
  try {
    const contacts = await getContact();

    const isContactExist = contacts.find((cont) => cont.name.trim() === userID);

    if (!isContactExist) {
      console.log("user doesn't exist");
      return false;
    }
    await pool.query(`DELETE FROM contact WHERE name = '${userID}'`);
  } catch (error) {
    console.log(error);
  }
};

const updateContact = async (userID, contactInput) => {
  try {
    const userDetail = await getContactDetail(userID);

    const contact = {
      name: contactInput.name || userDetail.name,
      email: contactInput.email || userDetail.email,
      mobile: contactInput.mobile || userDetail.mobile,
    };

    await pool.query(
      `UPDATE contact SET name = '${contact.name}', email = '${contact.email}', mobile='${contact.mobile}' WHERE name ='${userID}' `
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getContact,
  addContact,

  deleteContact,
  getContactDetail,
  updateContact,
};
