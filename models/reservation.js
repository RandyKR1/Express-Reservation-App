/** Reservation for Lunchly */

const moment = require("moment");

const db = require("../db");


/** A reservation for a party */

class Reservation {
  constructor({id, customerId, numGuests, startAt, notes}) {
    this.id = id;
    this.customerId = customerId;
    this.numGuests = numGuests;
    this.startAt = startAt;
    this.notes = notes;
  }


/* method for setting/getting a reservation */ 
  set startAt(val) {
    if (val instanceof Date && !isNaN(val)) this._startAt = val; //if the value is a Date and a number, set startAt to val.
    else throw new Error("Not a valid startAt.");
}   

  get startAt(){
    return this._startAt;
}
/** formatter for startAt */
  
  getformattedStartAt() {
    return moment(this.startAt).format('MMMM Do YYYY, h:mm a');
  }


/* methods for setting/getting numGuests */
  set numGuests(val){
    if (val <1){
      throw new Error('Number of guests can not be less that 1')
    }else{
      this._numGuests = val;
    }
  }

  get numGuests(){
    return this._numGuests;
  }

/* methods for setting/getting customerID */
  set customerId(val){
    if (this._customerId && this._customerId !== val){
      throw new Error('Customer ID cannot be changed');
    }else{
      this._customerId = val;
    }
  }

  get customerId(){
    return this._customerId;
  }

/* methods for setting/getting customerID */
  set notes(val){
    this._notes = val || "";
  } 

  get notes(){
    return this._notes;
  }

  /** given a customer id, find their reservations. */

  static async getReservationsForCustomer(customerId) {
    const results = await db.query(
          `SELECT id, 
           customer_id AS "customerId", 
           num_guests AS "numGuests", 
           start_at AS "startAt", 
           notes AS "notes"
         FROM reservations 
         WHERE customer_id = $1`,
        [customerId]
    );

    return results.rows.map(row => new Reservation(row));
  }

/* get reservation by id */
  static async get(id){
    const result = await db.query(`
      SELECT id, 
      customer_id AS 'Customer',
      num_guests AS 'Guests,
      start_at AS 'Start',
      notes
      FROM reservations WHERE id = $1`, [id]
    )

    let reservation = result.rows[0]

    if (reservation === undefined){
      throw new Error('No such reservation')
    }

    return new Reservation(reservation);
}

}


module.exports = Reservation;
