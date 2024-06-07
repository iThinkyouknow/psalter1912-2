package com.the_psalter_1912_2;

//import android.app.Application;

//import com.reactnativenavigation.NavigationApplication;
// import com.reactnativecommunity.clipboard.ClipboardPackage;
// import com.RNFetchBlob.RNFetchBlobPackage;
// import com.reactnativecommunity.slider.ReactSliderPackage;
// import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
// import com.jadsonlourenco.RNShakeEvent.RNShakeEventPackage;
// import org.wonday.pdf.RCTPdfView;
// import com.RNFetchBlob.RNFetchBlobPackage;
// import com.facebook.react.ReactNativeHost;
import com.reactnativenavigation.react.NavigationReactNativeHost;
// import com.facebook.react.ReactPackage;
// import com.facebook.react.shell.MainReactPackage;
// import com.facebook.soloader.SoLoader;

// import com.futurice.rctaudiotoolkit.AudioPackage;

// import java.util.Arrays;
// import java.util.List;

// import com.reactnativenavigation.NavigationApplication;

// //public class MainApplication extends NavigationApplication {
// public class MainApplication extends NavigationApplication {

//   @Override
//   public boolean isDebug() {
//     // Make sure you are using BuildConfig from your own application
//     return BuildConfig.DEBUG;
//   }

//   protected List<ReactPackage> getPackages() {
//     // Add additional packages you require here
//     // No need to add RnnPackage and MainReactPackage
//     return Arrays.<ReactPackage>asList(
//             // eg. new VectorIconsPackage()
//             new AudioPackage(),
//             new RCTPdfView(),
//             new RNShakeEventPackage(),
//             new ReactSliderPackage(),
//             new AsyncStoragePackage(),
//             new ClipboardPackage(),
//             new RNFetchBlobPackage()
//     );
//   }

//   @Override
//   public List<ReactPackage> createAdditionalReactPackages() {
//     return getPackages();
//   }

//   @Override
//   public String getJSMainModuleName() {
//     return "index";
//   }


//   //here
// //  private final ReactNativeHost mReactNativeHost = new NavigationReactNativeHost(this) {
// //    @Override
// //    public boolean getUseDeveloperSupport() {
// //      return BuildConfig.DEBUG;
// //    }
// //
// //    @Override
// //    protected List<ReactPackage> getPackages() {
// //      return Arrays.<ReactPackage>asList(
// //          new MainReactPackage(),
// //            new RNShakeEventPackage(),
// //            new RCTPdfView(),
// //            new RNFetchBlobPackage(),
// //            new RNShakeEventPackage()
// //      );
// //    }
// //
// //    @Override
// //    protected String getJSMainModuleName() {
// //      return "index";
// //    }
// //  };
// //
// //  @Override
// //  public ReactNativeHost getReactNativeHost() {
// //    return mReactNativeHost;
// //  }
// //
// //  @Override
// //  public void onCreate() {
// //    super.onCreate();
// //    
// //  }


// }


package com.rndiffapp
 
import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader
 
class MainApplication : Application(), ReactApplication {
 
  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // add(MyReactNativePackage())

              add(AudioPackage()),
              add(RCTPdfView()),
              add(RNShakeEventPackage()),
              add(ReactSliderPackage()),
              add(AsyncStoragePackage()),
              add(ClipboardPackage()),
              add(RNFetchBlobPackage())
            }
 
        override fun getJSMainModuleName(): String = "index"
 
        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG
 
        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }
 
  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)
 
  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, false)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      load()
    }
  }
}