import "../flow/config";
import * as fcl from "@onflow/fcl";
import styles from "../styles/Manage.module.css";
import { useEffect, useState } from "react";

// Events are identified using a specific syntax defined by Flow
// A.{contractAddress}.{contractName}.{eventName}
// 
// The following two constants are the event identifiers (event keys as Flow calls them)
// for the `ListingAvailable` and `ListingCompleted` events
// for NFTStorefront V1 on Flow Mainnet
const ListingAvailableEventKey =
  "A.4eb8a10cb9f87357.NFTStorefront.ListingAvailable";
const ListingCompletedEventKey =
  "A.4eb8a10cb9f87357.NFTStorefront.ListingCompleted";

export default function Home() {
  // Define two state variables to keep track of the two types of events
  const [availableEvents, setAvailableEvents] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
    
  // When page is first loaded, subscribe (listen for) new events
  useEffect(() => {
      
    // Listen for `ListingAvailable` events
    // Add any new events to the front of the state variable array
    // New events on top, old events on bottom
    fcl.events(ListingAvailableEventKey).subscribe(events => {
      setAvailableEvents(oldEvents => [events, ...oldEvents]);
    });
      
    // Similarly, listen for `ListingCompleted` events
    fcl.events(ListingCompletedEventKey).subscribe(events => {
      setCompletedEvents(oldEvents => [events, ...oldEvents]);
    });
  }, []);

  return (
    <div className={styles.main}>
      <div>
        <h2 className={styles.h2}>Listing Available</h2>
        <h4 className={styles.h4}>Updates every 2 seconds...</h4>
        <div className={styles.scroller}>
        <div className={styles.domainsContainer}>
          {availableEvents.length === 0
            // If the `availableEvents` array is empty, say that no events
            // have been tracked yet
            // Else, loop over the array, and display information given to us
            ? "No Listing Available events tracked yet"
            : 
            
            availableEvents.map((ae, idx) => (
                <div key={idx} className={styles.domainInfo}>
                  <p>Storefront: {ae.storefrontAddress}</p>
                  <p>Listing Resource ID: {ae.listingResourceID}</p>
                  <p>NFT Type: {ae.nftType.typeID}</p>
                  <p>NFT ID: {ae.nftID}</p>
                  <p>Token Type: {ae.ftVaultType.typeID}</p>
                  <p>Price: {ae.price}</p>
                </div>
              ))}
            </div>
        </div>
      </div>

      <div>
        <h2 className={styles.h2}>Listing Completed</h2>
        <h4 className={styles.h4}>Updates every 2 seconds</h4>
        <div className={styles.scroller}>
        <div className={styles.domainsContainer}>
          {completedEvents.length === 0
            // Similarly, do the same with `completedEvents`
            ? "No Listing Completed events tracked yet"
            : completedEvents.map((ce, idx) => (
                <div key={idx} className={styles.domainInfo}>
                  <p>Storefront Resource ID: {ce.storefrontResourceID}</p>
                  <p>Listing Resource ID: {ce.listingResourceID}</p>
                  <p>NFT Type: {ce.nftType.typeID}</p>
                  <p>NFT ID: {ce.nftID}</p>
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
}