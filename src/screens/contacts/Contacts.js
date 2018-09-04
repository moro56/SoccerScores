import React from "react";
import {View, StyleSheet, SectionList, Text} from "react-native";
import {observer} from "mobx-react";
import {ImageLoader} from 'react-native-image-fallback';
import {Button} from 'react-native-elements';

import {Contact} from "./../../realm";
import {contactStore} from "./../../stores";

@observer
class Contacts extends React.Component {
  state = {
    friend: Contact.allFriend(),
    invites: Contact.allInvites(),
    invited: Contact.allInvited()
  };

  componentDidMount() {
    const {friend, invites, invited} = this.state;

    friend.addListener(this._updateFriends);
    invites.addListener(this._updateInvites);
    invited.addListener(this._updateInvited);
  }

  componentWillUnmount() {
    const {friend, invites, invited} = this.state;

    friend.removeListener(this._updateFriends);
    invites.removeListener(this._updateInvites);
    invited.removeListener(this._updateInvited);
  }

  render() {
    const {friend, invites, invited} = this.state;

    const sections = [];
    if (friend && friend.length) {
      sections.push({data: friend, title: "Friends"})
    }
    if (invited && invited.length) {
      sections.push({data: invited, title: "Invites"})
    }
    if (invites && invites.length) {
      sections.push({data: invites, title: "Pending"})
    }

    return (
      <View style={styles.background}>
        <SectionList style={styles.list}
                     sections={sections}
                     renderItem={this._renderContact}
                     renderSectionHeader={this._renderHeader}/>
      </View>
    )
  }

  _renderHeader = ({section}) => {
    return (
      <Text style={styles.sectionHeader}>{section.title}</Text>
    )
  };

  _renderContact = ({item}) => {
    const {acceptInvite, rejectInvite} = contactStore;

    const invited = <View style={styles.inviteCOntainer}>
      <Button title={"Reject invite"} color={"red"} buttonStyle={styles.rejectInvite}
              onPress={() => rejectInvite(item.id)}/>
      <Button title={"Accept invite"} color={"#FF9800"} buttonStyle={styles.acceptInvite}
              onPress={() => acceptInvite(item.id)}/>
    </View>;

    return (
      <View style={styles.contactContainer}>
        <View style={styles.contactInnerContainer}>
          <ImageLoader style={styles.contactIcon} source={item.avatar}
                       fallback={[require("./../../assets/avatar_contatti.png")]}/>
          <View style={styles.contactTextContainer}>
            <Text style={styles.contactText}>{item.name}</Text>
            <Text style={styles.contactSubText}>{item.email}</Text>
          </View>
        </View>
        {item.invited && invited}
      </View>
    );
  };

  _updateFriends = () => {
    this.forceUpdate();
  };

  _updateInvites = () => {
    this.forceUpdate();
  };

  _updateInvited = () => {
    this.forceUpdate();
  };
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#FAFAFA"
  },
  list: {
    paddingTop: 8
  },
  sectionHeader: {
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 6,
    marginBottom: 8
  },
  contactContainer: {
    backgroundColor: "white",
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 2
  },
  contactInnerContainer: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center"
  },
  contactIcon: {
    width: 42,
    height: 42,
    borderRadius: 42
  },
  contactTextContainer: {
    marginLeft: 16,
    marginRight: 8,
    justifyContent: "center"
  },
  contactText: {
    fontSize: 16
  },
  contactSubText: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: -1
  },
  inviteCOntainer: {
    flexDirection: "row",
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 8,
    justifyContent: "flex-end"
  },
  acceptInvite: {
    height: 36,
    backgroundColor: "white",
    elevation: 1,
    marginRight: -8
  },
  rejectInvite: {
    height: 36,
    backgroundColor: "white",
    elevation: 1,
    marginRight: -16
  }
});

export default Contacts;
