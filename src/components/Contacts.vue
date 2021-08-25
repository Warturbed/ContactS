<template>
  <div class="container">
       <header class="header"> 
        <h1 class="header__title">Contact book</h1>
        <div class="header__content">
          <!--Search--> 
          <div class="search-form header__search-form"> 
            <label class="search-form__label" for="search"></label>
            <input class="search-form__input" type="text" placeholder="Search" id="search"
            v-model="search"
            >
          </div>
          <!--Sort--> 
          <div class="sort header__sort"><span class="sort__title" @click="toggleSortList">Sort by</span>
            <ul class="sort__list" v-if="isSortListVisible">
              <!--send category name to sort data-->
              <li class="sort__item"
              v-for="(item, index) in sortList"
              :key="index"
              @click="sortData(item.category)"
              >{{item.category}}</li>
            </ul>
          </div>
        </div>
      </header>
      <main class="contacts">
        <!--Contact list-->  
        <ul class="contacts__list">
          <!--Contact item--> 
          <li class="contacts-item"
            v-for="contact in isSorted"
            :key="contact.id"
            >
            <span class="contacts-item__name"
              :class="contact.favorite === true ? 'contacts-item__name--favorite' : '' "
              >
              {{contact.name}}
            </span>
            <img class="contacts-item__avatar" src="../img/user.png" alt="avatar">
            <span class="contacts-item__country">Country: {{contact.address.country}}</span>
            <span class="contacts-item__city">City: {{contact.address.city}}</span>
            <span class="contacts-item__email">Email: {{contact.email}}</span>
            <span class="contacts-item__phone">Phone: {{contact.phone}}</span>
            <button class="contacts-item__edit" @click="toggleEdit(contact.id)"></button>
          </li>
        </ul>
      </main>
      <!--Edit form--> 
      <div class="edit-form" v-if="isEditVisible === true">
              <p class="edit-form__title">Edit Contact</p>
              <ul class="edit-form__list">
                <li class="edit-form__item">
                  <label for="name">Name:</label>
                  <input type="text" id="name"
                    v-model="editContact.name"
                    >
                </li>
                <li class="edit-form__item">
                  <label for="country">Country:</label>
                  <input type="text" id="country"
                    v-model="editContact.address.country"
                    >
                </li>
                <li class="edit-form__item">
                  <label for="city">City:</label>
                  <input type="text" id="city"
                    v-model="editContact.address.city"
                    >
                </li>
                <li class="edit-form__item">
                  <label for="email">Email:</label>
                  <input type="text" id="email"
                    v-model="editContact.email"
                    >
                </li>
                <li class="edit-form__item">
                  <label for="phone">Phone:</label>
                  <input type="text" id="phone"
                    v-model="editContact.phone"
                    >
                </li>
                <li class="edit-form__item">
                  <label for="favorite">Favorite</label>
                  <input type="checkbox" id="favorite"
                  :value="editContact.favorite"
                  v-model="editContact.favorite"
                  :checked="editContact.favorite === true"
                   >
                </li>
              </ul>
              <!--send new values to state--> 
              <button class="edit-form__button" @click="changeContact(editContact)">Edit</button>
            </div>
    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'Contacts',
  data() {
    return {
      sortedContacts: [],
      search : '',
      sortList: [
        {
          category: 'All'
        },
        {
          category: 'Alphabet'
        },
        {
          category: 'Favorite'
        }
      ],
      isSortListVisible: false,
      isEditVisible: false,
      editContact: [],
    }
  },
  computed: {
    ...mapGetters([
      'CONTACTS'
    ]),
    // function of list of contacts mount on page
    isSorted () {
      // Sort
      if (this.sortedContacts.length && this.search === '') {
        return this.sortedContacts
      // Search
      } else if (!this.sortedContacts.length && this.search !== '') {
        // search for obj which includes search values and return them
        return [...this.CONTACTS].filter(item => {
          return (
            item.name.toLowerCase().includes(this.search.toLowerCase()) ||
            item.address.country.toLowerCase().includes(this.search.toLowerCase()) ||
            item.address.city.toLowerCase().includes(this.search.toLowerCase()) ||
            item.email.toLowerCase().includes(this.search.toLowerCase()) ||
            item.phone.toLowerCase().includes(this.search.toLowerCase()) 
          )
        })
      // Sort + Search
      } else if (this.sortedContacts.length && this.search !== '') {
        return [...this.sortedContacts].filter(item => {
          return (
            item.name.toLowerCase().includes(this.search.toLowerCase()) ||
            item.address.country.toLowerCase().includes(this.search.toLowerCase()) ||
            item.address.city.toLowerCase().includes(this.search.toLowerCase()) ||
            item.email.toLowerCase().includes(this.search.toLowerCase()) ||
            item.phone.toLowerCase().includes(this.search.toLowerCase()) 
          )
        })
      } 
      else {
        return this.CONTACTS
      }
    }
  },
  methods: {
    ...mapActions([
      'GET_CONTACTS_FROM_API',
      'CHANGE_CONTACT'
    ]),
    // Sort ul show / hide
    toggleSortList () {
      this.isSortListVisible = !this.isSortListVisible
    },
    // Sort by category
    sortData(category) {
      this.sortedContacts = []
      // if clicked category name == category :
      if (category === 'Alphabet') {
        // sort by alphabet and push to sortedContacts
        this.sortedContacts = [...this.CONTACTS].sort((a, b) => a.name.localeCompare(b.name));
      }
      if (category === 'Favorite') {
        let vm = this
        // find with favorite == true and push to sortedContacts
        this.CONTACTS.map(function (item) {
          if (item.favorite === true) {
            vm.sortedContacts.push(item)
          }
        })
      }
      // hide after click on category
      this.isSortListVisible = false
    },
    // change contact fnc
    toggleEdit(id) {
      this.editContact = []
      // check if edit popup visible
      if (this.isEditVisible === true) {
        this.isEditVisible = !this.isEditVisible
      // push new contact data to editContact arr
      } else {
        let vm = this
        this.CONTACTS.map(function (item) {
          if (item.id === id) {
            vm.editContact = item
          }
        })
        // hide popup after
        this.isEditVisible = !this.isEditVisible
      }
    },
    // send new contact data to state
    changeContact(contact) {
      this.CHANGE_CONTACT(contact)
      this.isEditVisible = !this.isEditVisible
    }
  },
  mounted() {
    // get server data if only contacts arr in store is empty
    if (!this.CONTACTS.length) {
      this.GET_CONTACTS_FROM_API()
    }
  }
}
</script>

<style lang="scss">
@import '../styles/style.scss'
</style>
